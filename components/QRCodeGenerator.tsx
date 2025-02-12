"use client"

import { useState, useRef, useCallback } from "react"
import QRCode from "qrcode"
import * as Select from "@radix-ui/react-select"
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons"

const colors = [
  { label: "Black", value: "#000000" },
  { label: "Blue", value: "#0000FF" },
  { label: "Red", value: "#FF0000" },
  { label: "Green", value: "#008000" },
]

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("")
  const [qrCode, setQRCode] = useState("")
  const [color, setColor] = useState("#000000")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQRCode = useCallback(async () => {
    try {
      const canvas = canvasRef.current
      if (canvas) {
        await QRCode.toCanvas(canvas, url, {
          width: 300,
          margin: 2,
          color: { dark: color, light: "#ffffff" },
        })
        setQRCode(canvas.toDataURL("image/png"))
      }
    } catch (err) {
      console.error(err)
    }
  }, [url, color])

  const handleColorChange = (value: string) => {
    setColor(value)
  }

  const handleDownload = (format: "png" | "jpg" | "svg") => {
    if (!url) return

    const canvas = canvasRef.current
    if (!canvas) return

    let downloadUrl: string
    let fileName: string

    switch (format) {
      case "png":
        downloadUrl = canvas.toDataURL("image/png")
        fileName = "qrcode.png"
        break
      case "jpg":
        downloadUrl = canvas.toDataURL("image/jpeg")
        fileName = "qrcode.jpg"
        break
      case "svg":
        QRCode.toString(url, { type: "svg", color: { dark: color, light: "#ffffff" } }, (err, string) => {
          if (err) throw err
          const svgBlob = new Blob([string], { type: "image/svg+xml;charset=utf-8" })
          downloadUrl = URL.createObjectURL(svgBlob)
          fileName = "qrcode.svg"
          const link = document.createElement("a")
          link.href = downloadUrl
          link.download = fileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
        return
      default:
        return
    }

    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL or text"
        className="w-full rounded-md border border-gray-300 p-2"
      />
      <div className="flex space-x-2">
        <Select.Root onValueChange={handleColorChange}>
          <Select.Trigger className="inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none">
            <Select.Value placeholder="Select a color" />
            <Select.Icon className="text-violet11">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
              <Select.Viewport className="p-[5px]">
                {colors.map((color) => (
                  <Select.Item
                    key={color.value}
                    value={color.value}
                    className="text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                  >
                    <Select.ItemText>{color.label}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        <button onClick={generateQRCode} className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Generate
        </button>
      </div>
      <div className="flex justify-center">
        <canvas ref={canvasRef} className="hidden" />
        {qrCode && <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-64 h-64" />}
      </div>
      {qrCode && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handleDownload("png")}
            className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Download PNG
          </button>
          <button
            onClick={() => handleDownload("jpg")}
            className="rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
          >
            Download JPG
          </button>
          <button
            onClick={() => handleDownload("svg")}
            className="rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
          >
            Download SVG
          </button>
        </div>
      )}
    </div>
  )
}

