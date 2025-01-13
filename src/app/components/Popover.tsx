"use client"
import { useState } from "react"
import React from "react"
import Box from "@mui/material/Box"
import Fade from "@mui/material/Fade"
import Backdrop from "@mui/material/Backdrop"
import { useMutation } from "@tanstack/react-query"
import Modal from "@mui/material/Modal"
import CloseIcon from "@mui/icons-material/Close"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { uploadImageToIPFS } from "../lib/uploadImage"
import { queryClient } from "@/utils/Provider"
import { redirect } from "next/navigation"
import { BookType } from "../lib/Books/fetcher"
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: "95vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "24px",
  px: 4,
  py: 2,
}

const API_URL = "/api/database/books/insert"

export const AddBookPopover = ({ open, handleClose }: { open: boolean; handleClose: any }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    totalCopies: "",
    availableCopies: "",
    price: "",
    image: null,
  })

  const handleSubmitMutation = async (formData: {
    image: File | null
    author: string
    title: string
    category: string
    totalCopies: string
    availableCopies: string
    price: string
  }) => {
    const { image, author, title, category, totalCopies, availableCopies, price } = formData

    const token = localStorage.getItem("auth_token")
    let imageUrl = ""

    if (image) {
      // Upload image to Pinata
      imageUrl = await uploadImageToIPFS(image)
      console.log("imageUrl", imageUrl)
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        author: author,
        category: category,
        totalCopies: parseInt(totalCopies, 10),
        availableCopies: parseInt(availableCopies, 10),
        price: parseFloat(price),
        image: imageUrl,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to insert book")
    }

    return response.json()
  }
  const mutation = useMutation({
    mutationFn: handleSubmitMutation,
    onMutate: () => {
      toast.loading("Updating Database...", {
        toastId: "submit-toast",
        icon: "⏳" as any,
      })
    },
    onSuccess: () => {
      toast.update("submit-toast", {
        render: <div>Data Submitted! </div>,
        type: "success",
        icon: "✅" as any,
        autoClose: 5000,
        isLoading: false,
      })
      queryClient.invalidateQueries({ queryKey: ["books"] })

      handleClose()
    },
    onError: (error: any) => {
      toast.update("submit-toast", {
        render: `Failed To Submit Form: ${error.message}`,
        type: "error",
        icon: "❌" as any,
        autoClose: 5000,
        isLoading: false,
      })
    },
    onSettled: () => {},
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const parsedData = {
      image: formData.get("image") as File | null,
      author: formData.get("author") as string,
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      totalCopies: formData.get("totalCopies") as string,
      availableCopies: formData.get("availableCopies") as string,
      price: formData.get("price") as string,
    }
    mutation.mutate(parsedData)
  }
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <CloseIcon
              sx={{ fontSize: "30px" }}
              className="text-[var(--foreground)] absolute top-5 right-5"
              onClick={handleClose}
            />
            <h1 className="font-bold flex justify-center items-center w-full text-3xl">Add Book</h1>

            <form onSubmit={handleSubmit} className="grid w-full max-w-sm items-center gap-1.5 mt-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter Book title..."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  type="text"
                  name="author"
                  id="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter Book Author..."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  type="text"
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter Book Category..."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="totalCopies">Total Copies</Label>
                <Input
                  type="number"
                  name="totalCopies"
                  id="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  placeholder="Enter Total Copies..."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="availableCopies">Available Copies</Label>
                <Input
                  type="number"
                  name="availableCopies"
                  id="availableCopies"
                  value={formData.availableCopies}
                  onChange={handleChange}
                  placeholder="Enter Available Copies..."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter Book Price..."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="image">Image</Label>
                <Input type="file" name="image" id="image" onChange={handleChange} accept="image/*" />
              </div>

              <div className="mt-6 flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-[var(--secondary)] px-8 py-2 w-80 rounded-lg text-white hover:bg-[#004D74] duration-300 ease-in-out transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export const DeleteBookPopover = ({
  open,
  handleClose,
  bookTitle,
}: {
  open: boolean
  handleClose: () => void
  bookTitle: string
}) => {
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/database/books/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ title: bookTitle }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to insert book")
      }
      return response.json()
    },

    onSuccess: () => {
      toast.success("Book deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["books"] })
      handleClose()
      router.replace("/admin/books?booksCategory=all")
    },
    onError: (error: any) => {
      console.error("Failed to delete book:", error)
      toast.error("Failed to delete the book.")
    },
  })

  const handleDelete = () => {
    mutation.mutate()
  }
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "60%",
              transform: "translate(-50%, -50%)",
              width: 500,
              height: "30vh",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: "24px",
              px: 4,
              py: 2,
            }}
          >
            <CloseIcon
              sx={{ fontSize: "30px" }}
              className="text-[var(--foreground)] absolute top-5 right-5"
              onClick={handleClose}
            />

            <div className="flex flex-col justify-evenly items-center h-full">
              <h1 className="font-bold flex justify-center text-center items-center w-full text-3xl">Delete Book</h1>

              <h1 className="  flex justify-center text-center items-center w-full text-sm">
                Are you sure you want to delete this book ?
              </h1>

              <div className="flex justify-center items-center w-full space-x-6 text-white font-semibold">
                <button
                  onClick={handleClose}
                  className="bg-[var(--secondary)] border-2 transition-all duration-300 ease-in-out border-[var(--secondary)] hover:bg-white hover:text-[var(--secondary)] px-6 py-2 flex items-center w-32 justify-center rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-[#FF2F2F] hover:bg-white hover:text-[#FF2F2F] border-2 transition-all duration-300 ease-in-out border-[#FF2F2F] px-6 py-2 flex items-center w-32 justify-center rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export const UpdateBookPopover = ({ open, handleClose, booksData }: { open: boolean; handleClose: any; booksData: BookType }) => {
  const [formData, setFormData] = useState({
    title: booksData.title,
    author: booksData.author,
    category: booksData.category,
    totalCopies: booksData.totalCopies,
    availableCopies: booksData.availableCopies,
    price: booksData.price,
    image: null,
  })
  const router = useRouter()
  const handleSubmitMutation = async (formData: {
    image: File | null
    author: string
    title: string
    category: string
    totalCopies: string
    availableCopies: string
    price: string
  }) => {
    const { image, author, category, totalCopies, availableCopies, price } = formData
    console.log("image", image)
    const token = localStorage.getItem("auth_token")
    let imageUrl = ""

    if (image && image.size > 0) {
      imageUrl = await uploadImageToIPFS(image)
      console.log("imageUrl", imageUrl)
    }
    console.log("imageUrl", imageUrl)
    const response = await fetch("/api/database/books/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: booksData.title,
        author: author,
        category: category,
        totalCopies: parseInt(totalCopies, 10),
        availableCopies: parseInt(availableCopies, 10),
        price: parseFloat(price),

        image: imageUrl || booksData.image,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update book")
    }

    return response.json()
  }
  const mutation = useMutation({
    mutationFn: handleSubmitMutation,
    onMutate: () => {
      toast.loading("Updating Database...", {
        toastId: "submit-toast",
        icon: "⏳" as any,
      })
    },
    onSuccess: () => {
      toast.update("submit-toast", {
        render: <div>Database Update! </div>,
        type: "success",
        icon: "✅" as any,
        autoClose: 5000,
        isLoading: false,
      })
      queryClient.invalidateQueries({ queryKey: ["books"] })

      handleClose()
      router.replace("/admin/books?booksCategory=all")
    },
    onError: (error: any) => {
      toast.update("submit-toast", {
        render: `Failed To Submit Form: ${error.message}`,
        type: "error",
        icon: "❌" as any,
        autoClose: 5000,
        isLoading: false,
      })
    },
    onSettled: () => {},
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const parsedData = {
      image: formData.get("image") as File | null,
      author: formData.get("author") as string,
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      totalCopies: formData.get("totalCopies") as string,
      availableCopies: formData.get("availableCopies") as string,
      price: formData.get("price") as string,
    }
    mutation.mutate(parsedData)
  }
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "60%",
              transform: "translate(-50%, -50%)",
              width: 400,
              height: "95vh",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: "24px",
              px: 4,
              py: 2,
            }}
          >
            <CloseIcon
              sx={{ fontSize: "30px" }}
              className="text-[var(--foreground)] absolute top-5 right-5"
              onClick={handleClose}
            />
            <h1 className="font-bold flex justify-center items-center w-full text-3xl">Update Book</h1>

            <form onSubmit={handleSubmit} className="grid w-full max-w-sm items-center gap-1.5 mt-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  disabled
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter Book title..."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  type="text"
                  name="author"
                  id="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter Book Author..."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  type="text"
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter Book Category..."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="totalCopies">Total Copies</Label>
                <Input
                  type="number"
                  name="totalCopies"
                  id="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  placeholder="Enter Total Copies..."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="availableCopies">Available Copies</Label>
                <Input
                  type="number"
                  name="availableCopies"
                  id="availableCopies"
                  value={formData.availableCopies}
                  onChange={handleChange}
                  placeholder="Enter Available Copies..."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter Book Price..."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="image">Image</Label>
                <Input type="file" name="image" id="image" onChange={handleChange} accept="image/*" />
              </div>

              <div className="mt-6 flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-[var(--secondary)] px-8 py-2 w-80 rounded-lg text-white hover:bg-[#004D74] duration-300 ease-in-out transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}
