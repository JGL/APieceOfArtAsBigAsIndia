      (function initCamera(config, callback) {
        var config = {video: true, audio: false};
        navigator.mediaDevices.getUserMedia(config).then(function(stream) {
          var video = document.querySelector('.bg-video');
          video.setAttribute('autoplay', true);
          video.src = window.URL.createObjectURL(stream);
          console.log('camera initialized');
        }).catch(function(error) {
          console.error('Error accessing camera', error)
        });
      })();