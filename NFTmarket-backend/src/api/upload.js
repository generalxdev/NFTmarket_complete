const express = require("express");
const { performance } = require('perf_hooks');
const multer = require('multer')
const cors = require('cors')
const path = require('path')
const log = require('../lib/logger')();
const { SpheronClient, ProtocolEnum } = require('@spheron/storage')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/api/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const app = express();
const client = new SpheronClient({ token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXkiOiJiNjkyY2Q2NDc1YzBlYzNlZTFkNWNmYmU2MTMzODE3YzE3YjVhOGFmMjU5MTQ0MTYzNDBjMmE4NjNjN2UwMTBiMzkyZmQ2M2RhY2JhZTU1MTE1NzdiNWU2YmEyNWI1YWVjMTAwM2JmOGQ3ZDVkODQ5Yzg4NTlkZDFiNTA5NGQ1OSIsImlhdCI6MTY4MjkzMzI5MywiaXNzIjoid3d3LnNwaGVyb24ubmV0d29yayJ9.0EJeKrp0HPxeU9h_vNU8tu6C4runBAQv73-vK7ZDJ_s' });
const upload = multer({ storage: storage })
app.use(cors())

app.post('/', upload.single('file'), async(req, res) => {
    
    try {
        console.log(req.file)
        const name = req.body.name
        const description = req.body.description

        var startTime = performance.now()
        const { uploadId, bucketId, protocolLink, dynamicLinks } = await client.upload
        (
            req.file.path,
            {
                protocol: ProtocolEnum.IPFS,
                name: name,
                description: description,
                onUploadInitiated: (uploadId) => {
                console.log(`Upload with id ${uploadId} started...`);
                },
                onChunkUploaded: (uploadedSize, totalSize) => {
                currentlyUploaded += uploadedSize;
                console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
                },
            }
         );
        console.log(bucketId, protocolLink)

        return res.status(200).send({
            result: 'success',
            data: protocolLink
        });
    } catch (e) {
        log.error(e);
    }
    return res.status(200).json({ result: 'fail', tokens: [] });
});


module.exports = app;