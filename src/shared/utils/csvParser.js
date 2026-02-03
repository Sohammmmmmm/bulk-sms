import Papa from "papaparse"
import { Contact } from "../../types/contact"

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data.map((row) => ({
          id: index,
          name: row.name || "",
          phone: row.phone || "",
          valid: /^[6-9]\d{9}$/.test(row.phone),
        }))
        resolve(data)
      },
      error: (err) => reject(err),
    })
  })
}
