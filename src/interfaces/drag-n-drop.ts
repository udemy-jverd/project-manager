interface IDraggable {
  dragStartHandler(event: DragEvent): void,
  dragEndHandler(event: DragEvent): void
}

interface IDragTarget {
  dragOverHandler(event: DragEvent): void,
  dropHandler(event: DragEvent): void,
  dragLeaveHandler(event: DragEvent): void
}

export { IDraggable, IDragTarget };
