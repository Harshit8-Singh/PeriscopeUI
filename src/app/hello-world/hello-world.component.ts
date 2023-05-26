import { ChangeDetectorRef, Component, ComponentFactory, OnInit, createComponent } from '@angular/core';
import { Message } from '../models/message';
import { HelloWorldService } from '../services/hello-world.service';

import { CanvasService } from '../services/canvas-service';

import { fabric } from 'fabric';
import { ComponentProvider } from '../services/componentProvider';
import { Database } from '../models/components/database';
import { Point } from 'fabric/fabric-impl';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.css']
})
export class HelloWorldComponent implements OnInit {

  public response = 'Could not connect to server!!';

  
  canvas : fabric.Canvas | undefined;

  constructor(
    private helloworldService : HelloWorldService,
    private componentFactory : ComponentProvider,
    // private canvasService : CanvasService,
   ){

    this.canvas = new fabric.Canvas('canvas');
   }

  ngOnInit(): void {
    this.showServerData();
    let createFabricObject = this.createFabricObject;
    
    // this.changeDetectorRef.detectChanges();

const container = document.getElementById('canvas-container') as HTMLDivElement;
const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;

const canvasWidth = container?.clientWidth;
const canvasHeight = container?.clientHeight;

console.log("canvasWidth:: " , canvasWidth);
console.log("canvasHeight:: ", canvasHeight);


// Create grid lines
// const options = {
//   distance: 10,
//   param: {
//     stroke: '#ebebeb',
//     strokeWidth: 1,
//     selectable: false
//   }
// };

const canvas = new fabric.Canvas(canvasElement, {
  width: canvasWidth ?? 0,
  height: canvasHeight ?? 0
});

this.createGridLines(canvas, canvasWidth, canvasHeight);



// Set the viewport transform to allow scrolling
canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

// Add event listeners to handle scrolling
container.addEventListener('scroll', handleScroll);

// function createGridLines() {
//   const gridLen = Math.max(canvasWidth, canvasHeight) / options.distance;

//   for (let i = 0; i < gridLen; i++) {
//     const distance = i * options.distance;

//     const horizontal = new fabric.Line(
//       [distance, 0, distance, canvasHeight],
//       options.param
//     );

//     const vertical = new fabric.Line(
//       [0, distance, canvasWidth, distance],
//       options.param
//     );

//     canvas.add(horizontal);
//     canvas.add(vertical);

//     if (i % 5 === 0) {
//       horizontal.set({ stroke: '#cccccc' });
//       vertical.set({ stroke: '#cccccc' });
//     }
//   }
// }

// createGridLines();

function handleScroll() {
  const { scrollTop, scrollLeft } = container;
  canvas.absolutePan({ x: -scrollLeft, y: -scrollTop });
}


let isDragging = false;
let lastPosX = 0;
let lastPosY = 0;

canvas.on('mouse:down', function (options) {
  const evt = options.e;
  if (evt.altKey === true) {
    isDragging = true;
    canvas.defaultCursor = 'grabbing';
    lastPosX = evt.clientX;
    lastPosY = evt.clientY;
  }
});

canvas.on('mouse:move', function (options) {
  if (isDragging) {
    const e = options.e;
    const deltaX = e.clientX - lastPosX;
    const deltaY = e.clientY - lastPosY;
    canvas.relativePan({ x: deltaX, y: deltaY });
    lastPosX = e.clientX;
    lastPosY = e.clientY;
  }
});

canvas.on('mouse:up', function () {
  isDragging = false;
  canvas.defaultCursor = 'default';
});

canvas.on('mouse:wheel', function (options) {
  const delta = options.e.deltaY;
  let zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);
  options.e.preventDefault();
  options.e.stopPropagation();
});

// delete object on the click on delete button on the selected object
canvas.on('object:selected', (event : fabric.IEvent) =>{
   const target : fabric.Object = event.target as fabric.Object;
  //  if(target !== canvas){

    target.on('delete:click', () =>{
      canvas.remove(target);
    // })
   });
});


  
function handleDragStart(this: HTMLImageElement, e: DragEvent): void {
  console.log("drag started:: ", e);
  const images: NodeListOf<HTMLImageElement> = document.querySelectorAll('.grid-item img');
  images.forEach((img: HTMLImageElement) => {
    img.classList.remove('img_dragging');
  });
  this.classList.add('img-dragging');
}

function handleDragOver(e: DragEvent): boolean {
  console.log("Drag-over")
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer!.dropEffect = 'copy';
  return false;
}


function handleDragEnter(this: HTMLElement, e: DragEvent): void {
  console.log("DragEnter")
  this.classList.add('over');
}

function handleDragLeave(this: HTMLElement, e: DragEvent): void {
  console.log("Drag Leave")
  this.classList.remove('over');
}

function handleDrop(this: HTMLElement, e: DragEvent): boolean {
  console.log("Handling drop")
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  const img: HTMLImageElement | null = document.querySelector('.grid-item img.img-dragging');
  console.log("adding img ", img);
  
  if (img) {
    console.log("id for image is", img.getAttribute("id"));
    const componentType : string  = img.getAttribute("id") as string;
    // const newImage = createFabricObject(componentType);
    const image = createFabricObject(componentType, e);

    

    console.log(img.width, img.height);
     const newImage: fabric.Image = new fabric.Image(img, {
      width: img.clientWidth + 50,
      height: img.clientHeight + 50,
    
      left: e.offsetX-25,
      top: e.offsetY-25,
      centeredScaling: true,
      originX: 'center', 
      originY: 'center',
    
    });
   
    

  



    // const component = 

    // img.onload = () => {
    //   const newImage = new fabric.Image(img, {
    //     width: img.width,
    //     height: img.height,
    //     left: e.offsetX,
    //     top: e.offsetY
    //   });
    //   canvas.add(newImage);
    // };

    
    console.log("adding image to canvas " , img);
    console.log(canvas.getObjects());

    canvas.add(newImage);
    console.log(canvas.getObjects());
    this.classList.remove('over');
  }

  return false;
}

function handleDragEnd(this: HTMLImageElement, e: DragEvent): void {
  console.log("handling drag end")
  const images: NodeListOf<HTMLImageElement> = document.querySelectorAll('.grid-item img.img-dragging');
  images.forEach((img: HTMLImageElement) => {
    img.classList.remove('img-dragging');
  });
}


const images: NodeListOf<HTMLImageElement> = document.querySelectorAll('.grid-item img');
images.forEach((img: HTMLImageElement) => {
  img.addEventListener('dragstart', handleDragStart, false);
  img.addEventListener('dragend', handleDragEnd, false);
});

const canvasContainer: HTMLElement | null = document.getElementById('canvas-container');
if (canvasContainer) {
  canvasContainer.addEventListener('dragenter', handleDragEnter);
  canvasContainer.addEventListener('dragover', handleDragOver);
  canvasContainer.addEventListener('dragleave', handleDragLeave);
  canvasContainer.addEventListener('drop', handleDrop);
} else {
  alert("This browser doesn't support the HTML5 Drag and Drop API.");
}





// canvas.on("dragover", function(options){
//     console.log("Dragging over ", options);
    
// })

// canvas.on("drop", function(options){
//   console.log("Dropping over ", options);
// })




// function dragStart(event: DragEvent): void {
//   // Store the ID of the dragged element in the data transfer object
//   event.dataTransfer!.setData('text/plain', event.target.id);
// }

// // Attach the drag start event listener to the draggable element
// draggableElement.addEventListener('dragstart', dragStart);

// // Define the drop event handler
// canvas.addEventListener('drop', drop);

// function drop(event: DragEvent): void {
//   event.preventDefault();
//   // Get the ID of the dragged element from the data transfer object
//   const draggedElementId: string = event.dataTransfer!.getData('text/plain');

//   // Call a method to draw the shape based on the dragged element
//   drawShape(draggedElementId);

//   // Reset the cursor style
//   canvas.style.cursor = 'default';
// }

// // Prevent default behavior for dragover event


// // Method to draw the shape based on the dragged element
// function drawShape(draggedElementId: string): void {
//   // Get the canvas 2D context
//   const ctx: CanvasRenderingContext2D | null = canvas.getContext();
//   if (ctx) {
//     ctx.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());

//     // Draw the shape based on the dragged element ID
//     if (draggedElementId === 'grid-item') {
//       // Draw a rectangle
//       ctx.fillStyle = 'red';
//       ctx.fillRect(50, 50, 100, 100);
//     }
//   }
// }

   
   
  }

  createFabricObject(componentType : string, event: DragEvent): fabric.Object{
    return this.componentFactory.;
    
    
  }



  showServerData(){
    this.helloworldService.getServerResponse()
    .subscribe((data: Message) => {
      console.log(data.response);
      this.response = data.response;
    });
  }

  createGridLines(canvas: fabric.Canvas, width: number, height: number) {
    // Grid options
    const options = {
      distance: 10,
      param: {
        stroke: '#ebebeb',
        strokeWidth: 1,
        selectable: false
      }
    };
  
    const gridLen = Math.max(width, height) / options.distance;
  
    for (let i = 0; i < gridLen; i++) {
      const distance = i * options.distance;
  
      const horizontal = new fabric.Line(
        [distance, 0, distance, height],
        options.param
      );
  
      const vertical = new fabric.Line(
        [0, distance, width, distance],
        options.param
      );
  
      canvas.add(horizontal);
      canvas.add(vertical);
  
      if (i % 5 === 0) {
        horizontal.set({ stroke: '#cccccc' });
        vertical.set({ stroke: '#cccccc' });
      }
    }
  }
  
    
}





