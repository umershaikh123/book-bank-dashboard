import { toast } from "react-toastify"

const JWT = process.env.NEXT_PUBLIC_PINATA_JWT || ""

export const uploadImageToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)

  const pinataMetadata = JSON.stringify({ name: file.name })
  formData.append("pinataMetadata", pinataMetadata)

  const pinataOptions = JSON.stringify({ cidVersion: 0 })
  formData.append("pinataOptions", pinataOptions)

  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
      body: formData,
    })

    if (!res.ok) {
      throw new Error(`Failed to upload image: ${res.statusText}`)
    }

    const data = await res.json()
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
  } catch (error) {
    toast.error("Error uploading image to IPFS")
    console.error("Error uploading image to IPFS:", error)
    throw error
  }
}
