import { readFileSync, writeFile } from "node:fs";
import { createServer } from "node:http";
// @ts-check
const server = createServer((request, response) => {
    switch (request.url) {
        case "/":
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ root: true }));
            break;
        
        case "/file":
            switch (request.method) {
                case "GET":
                    const fileContent = readFileSync("content.txt", "utf8");
                    response.writeHead(200, { "Content-Type": "text/plain" });
                    response.end(fileContent);
                    break;
    
                case "POST":
                    let body = "";
                    request.on("data", chunk => {
                        body += chunk.toString();
                    });
                    request.on("end", () => {
                        writeFile("content.txt",body,"utf8", (err)=>{
                            if(err){
                                response.writeHead(500, { "Content-Type": "text/plain" });
                                response.end("Error saving the file");
                                return;
                            }
                            response.writeHead(200, { "Content-Type": "text/plain" });
                            response.end("saved successfuly");
                        });
                    });
                    break;
    
                default:
                    response.writeHead(405, { "Content-Type": "text/plain" });
                    response.end("Method Not Allowed");
                    break;
            }
            break;
    
        default:
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.end("Not Found");
            break;
    }
    
});

const instance = server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on port", instance.address().port);
});
