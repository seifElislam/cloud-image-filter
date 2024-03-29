import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

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
  app.get("/filteredimage/", async (req: Request, res: Response) => {
    // IT SHOULD
    //    1. validate the image_url query
    let { image_url } = req.query;
    if (!image_url) {
      return res.status(400)
        .send(`a public image url is required.`);
    }
    var pattern = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;

    if (!pattern.test(image_url)) {
      return res.status(400)
        .send(`${image_url} is not a valid image url!`);
    }
    //    2. call filterImageFromURL(image_url) to filter the image
    try {
      let requestImgPath = await filterImageFromURL(image_url)
      //    3. send the resulting file in the response
      //    4. deletes any files on the server on finish of the response
      await res.status(200)
        .sendFile(requestImgPath, function (err) {
          if (err) {
            console.log(err);
            res.status(500).send('Can\'t return processed image')
          };
          deleteLocalFiles([requestImgPath])
        });
    }
    catch (err){
      console.log(">> Error : ", err)
       res.status(500).send('Can\'t process this image url') }

    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  });


  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();