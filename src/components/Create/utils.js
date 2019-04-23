import SparkMD5 from 'spark-md5'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function calcuateMD5(file, onSuccess, onError) {
  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    chunkSize = 2097152,                             // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    spark = new SparkMD5.ArrayBuffer(),
    fileReader = new FileReader();

  fileReader.onload = function (e) {
    spark.append(e.target.result);                   // Append array buffer
    currentChunk++;

    if (currentChunk < chunks) {
      loadNext();
    } else {
      onSuccess({ hash: spark.end() })
    }
  };

  fileReader.onerror = function () {
    onError('Unable to compute hash')
  };

  function loadNext() {
    var start = currentChunk * chunkSize,
      end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }

  loadNext();
}

const MD5Promise = (file) => {
  return new Promise((resolve, reject) => {
    calcuateMD5(file,
      (data) => resolve(data),
      (msg) => reject(msg)
    )
  })
}


export { capitalizeFirstLetter, calcuateMD5, MD5Promise }
