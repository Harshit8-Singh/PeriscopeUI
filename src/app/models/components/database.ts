import { fabric } from 'fabric';
import { Component } from './component';

export class Database extends Component {

    
  override createFabricObject(width?: number, height?: number, image?: string, position?: fabric.IPoint): fabric.Object {
    const fabricObject = super.createFabricObject(width, height, image, position);
    // Add additional customization specific to Database class
   
    // Add additional customization specific to Database class
    fabricObject.set({
      fill: 'blue',
      // Add any other properties or customization specific to Database objects
    });

    // Add image to fabric object
    if (image) {
      // fabric.Image.fromURL(image.g, (img) => {
        // img.scaleToWidth(image); // Scale image to desired width
        // img.scaleToHeight(height); // Scale image to desired height

        // fabricObject.addWithUpdate(img);
        fabricObject.setCoords();
      // });
    }

    return fabricObject;

  }

  createFabricObjectWithEvent(componentType : string, event : DragEvent): fabric.Object {
    const fabricObject = super.createFabricObjectWithEvent(componentType, event);
    // Add additional customization specific to Database class
   
    // Add additional customization specific to Database class
    fabricObject.set({
      fill: 'blue',
      // Add any other properties or customization specific to Database objects
    });

    // Add image to fabric object
    if (image) {
      // fabric.Image.fromURL(image.g, (img) => {
        // img.scaleToWidth(image); // Scale image to desired width
        // img.scaleToHeight(height); // Scale image to desired height

        // fabricObject.addWithUpdate(img);
        fabricObject.setCoords();
      // });
    }

    return fabricObject;
    
  }
}
