import { fabric } from 'fabric';
import { Connector } from './connector';

export interface Components {
  connections: Connector[];
  createFabricObject(width?: number, height?: number, image?: string , position?: fabric.IPoint): fabric.Object;
}

export class Component extends fabric.Object implements Components {

  connections: Connector[] = [];

  constructor() {
    super();
    // Set any default fabric.js object properties here
  }

  createFabricObject(width?: number, height?: number, image?: string, position?: fabric.IPoint): fabric.Object {
    const fabricObject = new fabric.Object();

    return fabricObject;
  }

  createFabricObjectWithEvent(componentType: string, event : DragEvent) {
    throw new Error('Method not implemented.');
  }
}
