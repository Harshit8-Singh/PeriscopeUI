import { fabric } from 'fabric';
import { Item } from './component';
import { Field } from '../formField';
import { formFieldType } from '../enums/formFieldType';

export class Database extends Item {

    
  // override createFabricObject(width?: number, height?: number, image?: string, position?: fabric.IPoint): fabric.Object {
  //   const fabricObject = super.createFabricObject(width, height, image, position);
  //   // Add additional customization specific to Database class
   
  //   // Add additional customization specific to Database class
  //   fabricObject.set({
  //     fill: 'blue',
  //     // Add any other properties or customization specific to Database objects
  //   });

  //   // Add image to fabric object
  //   if (image) {
  //     // fabric.Image.fromURL(image.g, (img) => {
  //       // img.scaleToWidth(image); // Scale image to desired width
  //       // img.scaleToHeight(height); // Scale image to desired height

  //       // fabricObject.addWithUpdate(img);
  //       fabricObject.setCoords();
  //     // });
  //   }

  //   return fabricObject;

  //   return fabricObject;
  // }

  
  override connections: any[];

  override formFields: Field[] = [
    {
      "name" : "tableNames",
      "fieldlabel": "Table Names(comma separated)",
      "type" : formFieldType.SHORT_STRING,
      "value": "Persons",
    },
    {
      "name" : "tableDefinitions",
      "fieldlabel": "Editor",
      "type" : formFieldType.CODE_EDITOR,
      "value": `CREATE TABLE Persons (
        PersonID int,
        LastName varchar(255),
        FirstName varchar(255),
        Address varchar(255),
        City varchar(255)
    );`
    }
  ];

  // override references: string[] = ["jdbcTemplate"];

  override references: Set<string> = new Set(["jdbcTemplate"]);

  imgUrl!: string;
  imageOptions!: fabric.IImageOptions;
  objects?: fabric.Object[];

  // properties for form and extendible

  // tables names field type should be a list, would add support for it later
  tableNames!: string[];
  tableDefinitions!: string[];
  // properties for form config, array for same
  

  constructor(event: DragEvent, width: number, height: number) {
    super();
    this.connections = [];
    this.imgUrl = "assets/databaseResized.png";
    this.type = "database";
    this.imageOptions = { 
        width: width + 14,
        height: height + 14,
        left: event.offsetX-25,
        top: event.offsetY-25,
        centeredScaling: true,
        originX: 'center', 
        originY: 'center',
      }
    
   
    fabric.Image.fromURL(this.imgUrl, (img) => {

      // setting image options
        img.set(this.imageOptions);
  
        console.log("image is : " , img);
        // Add the image to the custom group
        this.addWithUpdate(img);
  
        // // Set the connections property
        // this.connections = connections;
  
        // Render the custom group
        // this.canvas?.renderAll();
      });

     this.tableDefinitions = [];
     this.tableNames = [];


    
  }


 override unloadDataFromFormFields(): void {
  console.log("loading data from to formFields for ", this.type);
   for (const field of this.formFields) {
    switch (field.name) {
      case "tableNames":
        this.tableNames = field.value.split(","); // Split the comma-separated values into an array
        // this.references.push(...this.tableNames);
        this.tableNames.forEach((name) => this.references.add(name));
        break;
      case "tableDefinitions":
        this.tableDefinitions = field.value.split("$"); // Assign the value to the tableDefinitions array
        break;
      // Add cases for any other form fields you have in the class
    }
  }
 }

 override loadDataToFormFields(): void {
  for (const field of this.formFields) {
    switch (field.name) {
      case "tableNames":
        field.value = this.tableNames.join(","); // Join the tableNames array into a comma-separated string
        break;
      case "tableDefinitions":
        field.value = this.tableDefinitions.join("$");
       // Assign the first value from tableDefinitions to the field value
        break;
      // Add cases for any other form fields you have in the class
    }
  }
 }

 override toObject(propertiesToInclude?: string[] | undefined) {
    super.toObject();
    return fabric.util.object.extend(super.toObject(propertiesToInclude), {
      // already called super, do we really need it
      // connections: this.connections,
      // id: this.id,
      tableNames : this.tableNames,
      tableDefinitions: this.tableDefinitions


    });

 }
}
