 const FilesFilter = (req, file, cb)=> {
    // Accept this extensions only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|docx|pdf|.pptx|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'this  file format is not allowed- '+file.mimetype;
        return cb(new Error('this file format is not allowed'), false);
    }
    cb(null, true);
};
exports.FilesFilter=FilesFilter;