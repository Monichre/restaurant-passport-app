'use client'

import React, {useState} from 'react'
import {parseCSV} from '@/lib/csv'
import {toast} from 'sonner'
import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {AlertCircle, FileUp, Loader2} from 'lucide-react'
import {Progress} from '@/components/ui/progress'

type CSVUploadProps = {
  onUpload: (data: Record<string, unknown>[]) => Promise<void>
  requiredColumns: string[]
  entityName: string
  buttonText?: string
  icon?: React.ReactNode
}

export function CSVUpload({
  onUpload,
  requiredColumns,
  entityName,
  buttonText = 'Import CSV',
  icon = <FileUp className='h-4 w-4 mr-2' />,
}: CSVUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const droppedFile = event.dataTransfer.files?.[0]
    if (droppedFile) {
      if (
        droppedFile.type !== 'text/csv' &&
        !droppedFile.name.endsWith('.csv')
      ) {
        setError('Please upload a CSV file')
        return
      }
      setFile(droppedFile)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to upload')
      return
    }

    try {
      setIsUploading(true)
      setError(null)
      setUploadProgress(10)

      // Parse and validate the CSV
      const parsedData = await parseCSV(file, requiredColumns)
      setUploadProgress(50)

      // Upload the data using the provided callback
      await onUpload(parsedData)
      setUploadProgress(100)

      // Close dialog and show success message
      setTimeout(() => {
        setIsOpen(false)
        setIsUploading(false)
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        setUploadProgress(0)
        toast.success(`${entityName} imported successfully`)
      }, 500)
    } catch (error) {
      setError((error as Error).message)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setFile(null)
    setError(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='ml-2'>
          {icon}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Import {entityName}</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing {entityName.toLowerCase()} data. The
            file must include the following columns:
            <div className='mt-2 text-xs bg-muted p-2 rounded-md'>
              {requiredColumns.join(', ')}
            </div>
          </DialogDescription>
        </DialogHeader>

        <button
          type='button'
          className={`
            mt-4 border-2 border-dashed rounded-md p-6 w-full
            ${error ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'}
            transition-colors duration-200 ease-in-out
            flex flex-col items-center justify-center
            hover:border-primary/50 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary/50
          `}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          aria-label='Upload CSV file'
        >
          <input
            type='file'
            accept='.csv'
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
            disabled={isUploading}
          />

          <div className='text-center'>
            <FileUp className='mx-auto h-10 w-10 text-muted-foreground' />
            <p className='mt-2 text-sm font-medium'>
              {file
                ? file.name
                : 'Drag & drop your CSV file here or click to browse'}
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>
              {file
                ? `${(file.size / 1024).toFixed(2)} KB`
                : 'CSV files only (max 5MB)'}
            </p>
          </div>
        </button>

        {isUploading && (
          <div className='mt-4'>
            <div className='flex justify-between text-xs mb-1'>
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className='h-1' />
          </div>
        )}

        {error && (
          <Alert variant='destructive' className='mt-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className='mt-4'>
          <Button
            variant='outline'
            onClick={handleCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
