import * as React from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import { FormData } from "../admin/request/page"

export default function RequestDrawer({ open, onClose, data }: { open: boolean; onClose: () => void; data: any }) {
  console.log("data", data)
  return (
    <Drawer open={open} anchor="right" onClose={onClose}>
      <Box sx={{ width: 300, padding: 2 }} role="presentation">
        <h2 className="font-semibold text-lg">User Details</h2>
        <List>
          <span className="font-medium">{data.request_status} </span>
          {/* {Object.entries(data).map((value: any, index) => (
            <div key={index} className="py-2">
              <span className="font-medium">{data.request_status} </span>
            </div>
          ))} */}
        </List>
      </Box>
    </Drawer>
  )
}
