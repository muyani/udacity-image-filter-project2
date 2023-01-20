import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import { encrypted_password } from './config';





function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.log(req.headers)
  if (req.headers.authorization === encrypted_password){
    return next();
  }
  else {
    return res.status(401).send("Unauthorized");
  }

}


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

app.get("/filteredimage",requireAuth, async(req: Request,res: Response)=>{
  let img_url: string = "";
  img_url = req.query.image_url.toString();
  if (!img_url){
    return res.status(400).send("imageURL is required as query parameter")
  }
  const fImage = await filterImageFromURL(img_url);
  res.status(200).sendFile(fImage,()=>{
    deleteLocalFiles([fImage])

  })

})




  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();