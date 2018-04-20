import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as storage from '@google-cloud/storage'
import {spawn} from 'child-process-promise'
import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'
admin.initializeApp();
const gcs = storage({keyFilename: './credential.json'})
exports.generateThumbs = functions.storage.object().onFinalize(async (object, context) => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.

  if (!contentType.startsWith('image/') || !object.metadata) {
    return null
  }

  const fileName = path.basename(filePath)

  if (fileName.startsWith('thumb_')) {
    console.log("TUMBS!!")
    return null
  }

  const bucket = gcs.bucket(fileBucket)
  const tempFilePath = path.join(os.tmpdir(), fileName)
  const metadata = {
    contentType: contentType,
  }
  await bucket.file(filePath).download({ destination: tempFilePath, })
  console.log('Image downloaded locally to', tempFilePath)
  await spawn('convert', [tempFilePath, '-coalesce', '-resize', '200x200^', '-deconstruct', tempFilePath])
  console.log('Thumbnail created at', tempFilePath)
  // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
  const thumbFileName = `thumb_${fileName}`
  const thumbFilePath = path.join(path.dirname(filePath), thumbFileName)
  // Uploading the thumbnail.
  const r = await bucket.upload(tempFilePath, {
    destination: thumbFilePath,
    metadata: metadata,
  })
  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(tempFilePath)
  const config = {
    action: 'read',
    expires: '03-01-2500',
  }
  const url = (await r[0].getSignedUrl(config))
  await admin.firestore().doc(path.join('Zaiko', r[0].name.split('/')[0], 'items', fileName)).set({image: url[0], thumbs: 1}, {merge: true})
  return bucket.file(filePath).delete()
});
