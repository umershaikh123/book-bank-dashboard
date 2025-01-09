"use client"
import Image from "next/image"
import Header from "@/app/components/Header"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useRouter } from "next/navigation"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
const ImagePage = ({ params }: { params: { id: string } }) => {
  const imageIndex = parseInt(params.id, 10)
  const imageSrc = `/Images/booksData/image${imageIndex}.svg`
  const router = useRouter()
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-yellow-50 to-white rounded-[2rem] overflow-y-clip ">
      <Header page={"Books"} searchBarToggle={true} />
      <div className="">
        <button
          onClick={() => router.push("/admin/books?booksCategory=all")}
          className=" mt-5 ml-16 bg-[#282828] px-8 py-2 rounded-3xl flex items-center border-2  hover:bg-slate-700  border-[#282828] text-white duration-200 ease-in-out transition-all"
        >
          <ArrowBackIcon
            sx={{
              color: "white",
              fontSize: "20px",
              mr: "8px",
            }}
          />
          Back
        </button>
        <div className="flex items-center justify-center w-full h-[70vh] ">
          <div className="flex bg-white rounded-3xl shadow-md shadow-black w-[50vw] h-[25rem] px-10 py-6">
            <Image src={imageSrc} alt={`Image ${imageIndex}`} width={250} height={250} />

            <div className="flex flex-col space-y-8 text-[var(--secondary)] ml-16 mt-4">
              <div className="">
                <h1 className=" font-bold text-3xl">English Class X</h1>
                <p className=" text-slate-400  text-xs font-semibold">Tenth Edition</p>
              </div>
              <div>
                <h1 className=" font-bold text-2xl">Description</h1>
                <p className="text-slate-900 max-w-[30rem] text-base mt-2">
                  The English IX textbook for the Sindh Board is designed to align with the educational curriculum set by the
                  Board of Secondary Education, Sindh. This textbook is intended to enhance their English language skills in
                  reading, writing, speaking, and comprehension
                </p>
              </div>
              <div className="flex justify-center items-center w-full space-x-6 text-white font-semibold">
                <button className="bg-[var(--secondary)] px-6 py-2 flex items-center w-32  justify-center rounded-lg">
                  <EditIcon sx={{ mr: "4px" }} />
                  Edit
                </button>
                <button className="bg-[#FF2F2F] px-6 py-2 flex items-center w-32 justify-center rounded-lg">
                  <DeleteIcon sx={{ mr: "4px" }} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

{
  /* <Image src={BG} alt={`BG`} className="absolute h-[86vh] -z-10 top-0 " /> */
}
export default ImagePage
