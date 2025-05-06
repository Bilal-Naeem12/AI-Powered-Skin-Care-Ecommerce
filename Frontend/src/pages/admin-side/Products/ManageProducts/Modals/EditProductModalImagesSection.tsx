// src/components/EditProductModalImagesSection.tsx
import React, { useEffect, useState } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Grid,
  IconButton,
  Button,
  Typography,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

export type ImageItem =
  | { id: string; src: string; isNew: false }
  | { id: string; src: string; file: File; isNew: true }

interface Props {
  existingUrls: string[]                             // URLs already on the server
  newFiles: File[]                                   // Newly selected files
  setNewFiles: React.Dispatch<React.SetStateAction<File[]>>
  setExistingUrls: React.Dispatch<React.SetStateAction<string[]>>
  onMarkRemoved: (url: string) => void               // flag an existing URL for deletion
}

export default function EditProductModalImagesSection({
  existingUrls,
  newFiles,
  setNewFiles,
  setExistingUrls,
  onMarkRemoved,
}: Props) {
  // single source-of-truth for ordering & removal
  const [items, setItems] = useState<ImageItem[]>([])

  // 1) Initialize items from existing URLs ONCE (or whenever existingUrls prop changes)
  useEffect(() => {
    const ex = existingUrls.map(u => ({
      id: u,
      src: u,
      isNew: false,
    } as const))
    setItems(ex)
  }, [existingUrls])

  // 2) DnD-kit setup
  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd(evt: DragEndEvent) {
    const { active, over } = evt
    if (!over || active.id === over.id) return

    setItems(current => {
      const oldIndex = current.findIndex(i => i.id === active.id)
      const newIndex = current.findIndex(i => i.id === over.id)
      const newOrder = arrayMove(current, oldIndex, newIndex)
      
          setExistingUrls(newOrder.filter(i => !i.isNew).map(i => i.src))
  setNewFiles   (newOrder.filter(i =>  i.isNew).map(i => i.file))
      return arrayMove(current, oldIndex, newIndex)
    })
  }

  // 3) Remove an item
  function handleRemove(item: ImageItem) {
    if (item.isNew) {
      // drop from the preview + newFiles
      setItems(cur => cur.filter(i => i.id !== item.id))
      setNewFiles(cur => cur.filter(f => `${f.name}-${f.lastModified}-${f.size}` !== item.id))
    } else {
      // flag for backend deletion & remove from preview
      onMarkRemoved(item.src)
      setItems(cur => cur.filter(i => i.id !== item.id))

    }
  }

  // 4) Add new files
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ?? []
    if (!files.length) return

    const newItems: ImageItem[] = Array.from(files).map(f => ({
      id: `${f.name}-${f.lastModified}-${f.size}`,
      src: URL.createObjectURL(f),
      file: f,
      isNew: true,
    }))
    setItems(cur => [...cur, ...newItems])
    setNewFiles(cur => [...cur, ...Array.from(files)])
  }

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="subtitle1" gutterBottom>
        Images
      </Typography>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(i => i.id)}
          strategy={rectSortingStrategy}
        >
          <Grid container spacing={1}>
            {items.map(item => (
              <SortableImageCard
                key={item.id}
                item={item}
                onRemove={() => handleRemove(item)}
              />
            ))}
          </Grid>
        </SortableContext>
      </DndContext>

      <Button
        variant="outlined"
        component="label"
        sx={{ mt: 2 }}
      >
        Upload Images
        <input
          hidden
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>
    </div>
  )
}

function SortableImageCard({
  item,
  onRemove,
}: {
  item: ImageItem
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: "relative",
    width: 96,
    height: 96,
    margin: 4,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img
        src={item.src}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 4,
        }}
      />
      <IconButton
        size="small"
        onClick={onRemove}
        sx={{ position: "absolute", top: 0, right: 0 }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  )
}