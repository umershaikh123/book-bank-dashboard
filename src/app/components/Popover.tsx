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
import axios from "axios"
import { toast } from "react-toastify"
import { uploadImageToIPFS } from "../lib/uploadImage"
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

const insertBook = async (bookData: FormData) => {
  const token = localStorage.getItem("auth_token")

  console.log("bookData", bookData)

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: bookData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.log("Failed to insert book ")
    throw new Error(errorData.error || "Failed to insert book")
  }

  return response.json()
}

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

  const mutation = useMutation({
    mutationFn: insertBook,
    onMutate: async (variables) => {
      toast.info("Updating Database")
      console.log("Starting mutation with data:", variables)
    },
    onSuccess: (data) => {
      console.log("Book added successfully ", data.message)
      toast.success("Book added successfully")
      handleClose()
    },
    onError: (error: any) => {
      console.error("Failed to add book ", error.message)
      toast.error("Failed to add book")
    },
    onSettled: () => {
      console.log("Mutation has settled (success or failure)")
    },
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { image, author, title, category, totalCopies, availableCopies, price } = formData
    try {
      const token = localStorage.getItem("auth_token")
      const pendingToastId = toast.loading("Updating Database...", {
        icon: "⏳" as any,
      })
      let imageUrl = ""
      if (image) {
        // Upload image to Pinata

        imageUrl = await uploadImageToIPFS(image as File)
        console.log("imageUrl", imageUrl)
      }
      console.log("formData", formData)
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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

      toast.update(pendingToastId, {
        render: <div>Data Submitted! </div>,
        type: "success",
        icon: "✅" as any,
        autoClose: 5000,
        isLoading: false,
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.log("Failed to insert book ")
        toast.update(pendingToastId, {
          render: `Failed To Submit Form`,
          type: "error",
          icon: "❌" as any,
          autoClose: 5000,
          isLoading: false,
        })
        throw new Error(errorData.error || "Failed to insert book")
      }

      return response.json()
      // mutation.mutate(bookData)
    } catch (error) {
      console.error("Error during form submission:", error)
    }
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
