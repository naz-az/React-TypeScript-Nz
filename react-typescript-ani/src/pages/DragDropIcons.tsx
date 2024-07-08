import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './DragDropIcons.module.css';

// Draggable Icon Component
interface DraggableIconProps {
  id: string;
  type: string;
  origin: 'initial' | 'dropZone';
  moveIcon: (id: string, origin: 'initial' | 'dropZone') => void;
}

const DraggableIcon: React.FC<DraggableIconProps> = ({ id, type, origin, moveIcon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { id, origin },
    end: (item, monitor) => {
      if (!monitor.didDrop() && origin === 'dropZone') {
        moveIcon(item.id, 'initial');
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`${styles.icon} ${isDragging ? styles.iconDragging : ''}`}
    >
      <img src={`/icons/${type}.png`} alt={type} draggable="false" style={{ width: 50, height: 50 }} />
    </div>
  );
};

// Drop Zone Component
interface DropZoneProps {
  onDrop: (item: { id: string }) => void;
  children: React.ReactNode;
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop, children }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'icon',
    drop: onDrop,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;

  return (
    <div
      ref={drop}
      className={`${styles.dropZoneContainer} ${isActive ? styles.dropZoneActive : ''}`}
    >
      {children}
    </div>
  );
};

// Main DragDropIcons Component
const DragDropIcons: React.FC = () => {
  const [icons, setIcons] = useState(['icon1', 'icon2', 'icon3', 'icon4', 'icon5']);
  const [dropZoneIcons, setDropZoneIcons] = useState<string[]>([]);

  const moveIconToDropZone = (id: string) => {
    setIcons((prevIcons) => prevIcons.filter((icon) => icon !== id));
    setDropZoneIcons((prevDropZoneIcons) => [...prevDropZoneIcons, id]);
  };

  const moveIconToOriginalPosition = (id: string) => {
    setDropZoneIcons((prevDropZoneIcons) => prevDropZoneIcons.filter((icon) => icon !== id));
    setIcons((prevIcons) => [...prevIcons, id]);
  };

  const moveIcon = (id: string, origin: 'initial' | 'dropZone') => {
    if (origin === 'initial') {
      moveIconToDropZone(id);
    } else {
      moveIconToOriginalPosition(id);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        <div className={styles.iconsContainer}>
          {icons.map((icon) => (
            <DraggableIcon key={icon} id={icon} type="icon" origin="initial" moveIcon={moveIcon} />
          ))}
        </div>
        <DropZone onDrop={(item) => moveIcon(item.id, 'dropZone')}>
          {dropZoneIcons.map((icon) => (
            <DraggableIcon key={icon} id={icon} type="icon" origin="dropZone" moveIcon={moveIcon} />
          ))}
        </DropZone>
      </div>
    </DndProvider>
  );
};

export default DragDropIcons;
