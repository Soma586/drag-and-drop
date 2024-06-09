"use client";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useDraggable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";

import { useState } from "react";
import bridge from "../../public/bridge.webp";
import beach from "../../public/beach.jpeg";
import park from "../../public/centralpark.jpeg";
import paris from "../../public/paris.jpeg";

function DraggableItem({ id, name, location, image }) {
  const { attributes, listeners, setNodeRef, isDragging, isOver } = useSortable(
    { id }
  );

  const itemStyle = `transition-opacity ${
    isDragging ? "opacity-50" : "opacity-100"
  } ${isOver ? "border-2 border-blue-500" : "border-none"} ${
    isDragging ? "bg-gray-200" : "bg-white"
  } ${isDragging ? "cursor-not-allowed" : "cursor-auto"}`;

  return (
    <div className={itemStyle} ref={setNodeRef} {...attributes} {...listeners}>
      <div className="py-2 px-0 pl-8 flex items-center">
        <Image
          src={image}
          alt={name}
          className="rounded-lg"
          width={200}
          height={200}
        />
        <div className="ml-8">
          <h3>{name}</h3>
          <p className="text-gray-300"> 📍 {location}</p>
        </div>
      </div>
    </div>
  );
}

function DragPreview({ item }) {
  return (
    <div style={{ width: "300px" }}>
      <div className="p-4 border border-gray-300 shadow-lg bg-white w-300 flex items-center rounded-lg ">
        <Image
          src={item.image}
          width={80}
          height={80}
          className="rounded-lg mr-4 object-cover"
        />
        <span>{item.name}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Scotland Island",
      location: "Sydney, Australia",
      image: beach,
    },
    {
      id: 2,
      name: "The Charles Grand Brasserie & Bar",
      location: "Lorem ipsum, Dolor",
      image: paris,
    },
    { id: 3, name: "Bridge Climb", location: "Dolor, Sit amet", image: bridge },
    {
      id: 4,
      name: "Australia Park",
      location: "Sydney, Australia",
      image: park,
    },
  ]);

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const activeItem = items.find((item) => item.id === activeId);

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div>
            {items.map((item) => (
              <DraggableItem key={item.id} id={item.id} {...item} />
            ))}
          </div>
        </SortableContext>

        {activeItem && (
          <DragOverlay>
            <DragPreview
              item={activeItem}
            />
          </DragOverlay>
        )}
      </DndContext>
    </div>
  );
}
