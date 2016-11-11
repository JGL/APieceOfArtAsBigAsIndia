'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = aframeDraggableComponent;

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _linear_regression = require('simple-statistics/src/linear_regression');

var _linear_regression2 = _interopRequireDefault(_linear_regression);

var _linear_regression_line = require('simple-statistics/src/linear_regression_line');

var _linear_regression_line2 = _interopRequireDefault(_linear_regression_line);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMPONENT_NAME = 'click-drag';
var DRAG_START_EVENT = 'dragstart';
var DRAG_MOVE_EVENT = 'dragmove';
var DRAG_END_EVENT = 'dragend';

var TIME_TO_KEEP_LOG = 300;

function forceWorldUpdate(threeElement) {

  var element = threeElement;
  while (element.parent) {
    element = element.parent;
  }

  element.updateMatrixWorld(true);
}

function forEachParent(element, lambda) {
  while (element.attachedToParent) {
    element = element.parentElement;
    lambda(element);
  }
}

function someParent(element, lambda) {
  while (element.attachedToParent) {
    element = element.parentElement;
    if (lambda(element)) {
      return true;
    }
  }
  return false;
}

function cameraPositionToVec3(camera, vec3) {

  vec3.set(camera.components.position.data.x, camera.components.position.data.y, camera.components.position.data.z);

  forEachParent(camera, function (element) {

    if (element.components && element.components.position) {
      vec3.set(vec3.x + element.components.position.data.x, vec3.y + element.components.position.data.y, vec3.z + element.components.position.data.z);
    }
  });
}

function localToWorld(THREE, threeCamera, vector) {
  forceWorldUpdate(threeCamera);
  return threeCamera.localToWorld(vector);
}

var _ref = function unprojectFunction() {

  var initialized = false;

  var matrix = void 0;

  function initialize(THREE) {
    matrix = new THREE.Matrix4();

    return true;
  }

  return {
    unproject: function unproject(THREE, vector, camera) {

      var threeCamera = camera.components.camera.camera;

      initialized = initialized || initialize(THREE);

      vector.applyProjection(matrix.getInverse(threeCamera.projectionMatrix));

      return localToWorld(THREE, threeCamera, vector);
    }
  };
}(),
    unproject = _ref.unproject;

function clientCoordsTo3DCanvasCoords(clientX, clientY, offsetX, offsetY, clientWidth, clientHeight) {
  return {
    x: (clientX - offsetX) / clientWidth * 2 - 1,
    y: -((clientY - offsetY) / clientHeight) * 2 + 1
  };
}

var _ref2 = function screenCoordsToDirectionFunction() {

  var initialized = false;

  var mousePosAsVec3 = void 0;
  var cameraPosAsVec3 = void 0;

  function initialize(THREE) {
    mousePosAsVec3 = new THREE.Vector3();
    cameraPosAsVec3 = new THREE.Vector3();

    return true;
  }

  return {
    screenCoordsToDirection: function screenCoordsToDirection(THREE, aframeCamera, _ref3) {
      var clientX = _ref3.x,
          clientY = _ref3.y;


      initialized = initialized || initialize(THREE);

      // scale mouse coordinates down to -1 <-> +1

      var _clientCoordsTo3DCanv = clientCoordsTo3DCanvasCoords(clientX, clientY, 0, 0, // TODO: Replace with canvas position
      window.innerWidth, window.innerHeight),
          mouseX = _clientCoordsTo3DCanv.x,
          mouseY = _clientCoordsTo3DCanv.y;

      mousePosAsVec3.set(mouseX, mouseY, -1);

      // apply camera transformation from near-plane of mouse x/y into 3d space
      // NOTE: This should be replaced with THREE code directly once the aframe bug
      // is fixed:
      /*
            cameraPositionToVec3(aframeCamera, cameraPosAsVec3);
            const {x, y, z} = new THREE
             .Vector3(mouseX, mouseY, -1)
             .unproject(aframeCamera.components.camera.camera)
             .sub(cameraPosAsVec3)
             .normalize();
      */
      var projectedVector = unproject(THREE, mousePosAsVec3, aframeCamera);

      cameraPositionToVec3(aframeCamera, cameraPosAsVec3);

      // Get the unit length direction vector from the camera's position

      var _projectedVector$sub$ = projectedVector.sub(cameraPosAsVec3).normalize(),
          x = _projectedVector$sub$.x,
          y = _projectedVector$sub$.y,
          z = _projectedVector$sub$.z;

      return { x: x, y: y, z: z };
    }
  };
}(),
    screenCoordsToDirection = _ref2.screenCoordsToDirection;

/**
 * @param planeNormal {THREE.Vector3}
 * @param planeConstant {Float} Distance from origin of the plane
 * @param rayDirection {THREE.Vector3} Direction of ray from the origin
 *
 * @return {THREE.Vector3} The intersection point of the ray and plane
 */


function rayPlaneIntersection(planeNormal, planeConstant, rayDirection) {
  // A line from the camera position toward (and through) the plane
  var distanceToPlane = planeConstant / planeNormal.dot(rayDirection);
  return rayDirection.multiplyScalar(distanceToPlane);
}

var _ref4 = function directionToWorldCoordsFunction() {

  var initialized = false;

  var direction = void 0;
  var cameraPosAsVec3 = void 0;

  function initialize(THREE) {
    direction = new THREE.Vector3();
    cameraPosAsVec3 = new THREE.Vector3();

    return true;
  }

  return {
    /**
     * @param camera Three.js Camera instance
     * @param Object Position of the camera
     * @param Object position of the mouse (scaled to be between -1 to 1)
     * @param depth Depth into the screen to calculate world coordinates for
     */
    directionToWorldCoords: function directionToWorldCoords(THREE, aframeCamera, camera, _ref5, depth) {
      var directionX = _ref5.x,
          directionY = _ref5.y,
          directionZ = _ref5.z;


      initialized = initialized || initialize(THREE);

      cameraPositionToVec3(aframeCamera, cameraPosAsVec3);
      direction.set(directionX, directionY, directionZ);

      // A line from the camera position toward (and through) the plane
      var newPosition = rayPlaneIntersection(camera.getWorldDirection(), depth, direction);

      // Reposition back to the camera position

      var _newPosition$add = newPosition.add(cameraPosAsVec3),
          x = _newPosition$add.x,
          y = _newPosition$add.y,
          z = _newPosition$add.z;

      return { x: x, y: y, z: z };
    }
  };
}(),
    directionToWorldCoords = _ref4.directionToWorldCoords;

var _ref6 = function selectItemFunction() {

  var initialized = false;

  var cameraPosAsVec3 = void 0;
  var directionAsVec3 = void 0;
  var raycaster = void 0;
  var plane = void 0;

  function initialize(THREE) {
    plane = new THREE.Plane();
    cameraPosAsVec3 = new THREE.Vector3();
    directionAsVec3 = new THREE.Vector3();
    raycaster = new THREE.Raycaster();

    // TODO: From camera values?
    raycaster.far = Infinity;
    raycaster.near = 0;

    return true;
  }

  return {
    selectItem: function selectItem(THREE, selector, camera, clientX, clientY) {

      initialized = initialized || initialize(THREE);

      var _screenCoordsToDirect = screenCoordsToDirection(THREE, camera, { x: clientX, y: clientY }),
          directionX = _screenCoordsToDirect.x,
          directionY = _screenCoordsToDirect.y,
          directionZ = _screenCoordsToDirect.z;

      cameraPositionToVec3(camera, cameraPosAsVec3);
      directionAsVec3.set(directionX, directionY, directionZ);

      raycaster.set(cameraPosAsVec3, directionAsVec3);

      // Push meshes onto list of objects to intersect.
      // TODO: Can we do this at some other point instead of every time a ray is
      // cast? Is that a micro optimization?
      var objects = Array.from(camera.sceneEl.querySelectorAll('[' + selector + ']')).map(function (object) {
        return object.object3D;
      });

      var recursive = true;

      var intersected = raycaster.intersectObjects(objects, recursive)
      // Only keep intersections against objects that have a reference to an entity.
      .filter(function (intersection) {
        return !!intersection.object.el;
      })
      // Only keep ones that are visible
      .filter(function (intersection) {
        return intersection.object.parent.visible;
      })
      // The first element is the closest
      [0]; // eslint-disable-line no-unexpected-multiline

      if (!intersected) {
        return {};
      }

      var point = intersected.point,
          object = intersected.object;

      // Aligned to the world direction of the camera
      // At the specified intersection point

      plane.setFromNormalAndCoplanarPoint(camera.components.camera.camera.getWorldDirection().clone().negate(), point.clone().sub(cameraPosAsVec3));

      var depth = plane.constant;

      var offset = point.sub(object.getWorldPosition());

      return { depth: depth, offset: offset, element: object.el };
    }
  };
}(),
    selectItem = _ref6.selectItem;

function dragItem(THREE, element, offset, camera, depth, mouseInfo) {

  var threeCamera = camera.components.camera.camera;

  // Setting up for rotation calculations
  var startCameraRotationInverse = threeCamera.getWorldQuaternion().inverse();
  var startElementRotation = element.object3D.getWorldQuaternion();
  var elementRotationOrder = element.object3D.rotation.order;

  var rotationQuaternion = new THREE.Quaternion();
  var rotationEuler = element.object3D.rotation.clone();

  var offsetVector = new THREE.Vector3(offset.x, offset.y, offset.z);
  var lastMouseInfo = mouseInfo;

  var nextRotation = {
    x: THREE.Math.radToDeg(rotationEuler.x),
    y: THREE.Math.radToDeg(rotationEuler.y),
    z: THREE.Math.radToDeg(rotationEuler.z)
  };

  var activeCamera = element.sceneEl.systems.camera.activeCameraEl;

  var isChildOfActiveCamera = someParent(element, function (parent) {
    return parent === activeCamera;
  });

  function onMouseMove(_ref7) {
    var clientX = _ref7.clientX,
        clientY = _ref7.clientY;


    lastMouseInfo = { clientX: clientX, clientY: clientY };

    var direction = screenCoordsToDirection(THREE, camera, { x: clientX, y: clientY });

    var _directionToWorldCoor = directionToWorldCoords(THREE, camera, camera.components.camera.camera, direction, depth),
        x = _directionToWorldCoor.x,
        y = _directionToWorldCoor.y,
        z = _directionToWorldCoor.z;

    var rotationDiff = void 0;

    // Start by rotating backwards from the initial camera rotation
    rotationDiff = rotationQuaternion.copy(startCameraRotationInverse);

    // rotate the offset
    offsetVector.set(offset.x, offset.y, offset.z);

    // Then add the current camera rotation
    rotationDiff = rotationQuaternion.multiply(threeCamera.getWorldQuaternion());

    offsetVector.applyQuaternion(rotationDiff);

    if (!isChildOfActiveCamera) {
      // And correctly offset rotation
      rotationDiff.multiply(startElementRotation);

      rotationEuler.setFromQuaternion(rotationDiff, elementRotationOrder);
    }

    nextRotation.x = THREE.Math.radToDeg(rotationEuler.x);
    nextRotation.y = THREE.Math.radToDeg(rotationEuler.y);
    nextRotation.z = THREE.Math.radToDeg(rotationEuler.z);

    var nextPosition = { x: x - offsetVector.x, y: y - offsetVector.y, z: z - offsetVector.z };

    // When the element has parents, we need to convert its new world position
    // into new local position of its parent element
    if (element.parentEl !== element.sceneEl) {

      // The new world position
      offsetVector.set(nextPosition.x, nextPosition.y, nextPosition.z);

      // Converted
      element.parentEl.object3D.worldToLocal(offsetVector);

      nextPosition.x = offsetVector.x;
      nextPosition.y = offsetVector.y;
      nextPosition.z = offsetVector.z;
    }

    element.emit(DRAG_MOVE_EVENT, { nextPosition: nextPosition, nextRotation: nextRotation, clientX: clientX, clientY: clientY });

    //element.setAttribute('position', nextPosition);

    //element.setAttribute('rotation', nextRotation);
  }

  function onTouchMove(_ref8) {
    var _ref8$changedTouches = _slicedToArray(_ref8.changedTouches, 1),
        touchInfo = _ref8$changedTouches[0];

    onMouseMove(touchInfo);
  }

  function onCameraChange(_ref9) {
    var detail = _ref9.detail;

    if ((detail.name === 'position' || detail.name === 'rotation') && !(0, _deepEqual2.default)(detail.oldData, detail.newData)) {
      onMouseMove(lastMouseInfo);
    }
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('touchmove', onTouchMove);
  camera.addEventListener('componentchanged', onCameraChange);

  // The "unlisten" function
  return function (_) {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('touchmove', onTouchMove);
    camera.removeEventListener('componentchanged', onCameraChange);
  };
}

// Closure to close over the removal of the event listeners

var _ref10 = function getDidMountAndUnmount() {

  var removeClickListeners = void 0;
  var removeDragListeners = void 0;
  var cache = [];

  function initialize(THREE, componentName) {

    // TODO: Based on a scene from the element passed in?
    var scene = document.querySelector('a-scene');
    // delay loading of this as we're not 100% if the scene has loaded yet or not
    var camera = void 0;
    var draggedElement = void 0;
    var dragInfo = void 0;
    var positionLog = [];

    function cleanUpPositionLog() {
      var now = performance.now();
      while (positionLog.length && now - positionLog[0].time > TIME_TO_KEEP_LOG) {
        // remove the first element;
        positionLog.shift();
      }
    }

    function onDragged(_ref11) {
      var nextPosition = _ref11.detail.nextPosition;

      // Continuously clean up so we don't get huge logs built up
      cleanUpPositionLog();
      positionLog.push({
        position: Object.assign({}, nextPosition),
        time: performance.now()
      });
    }

    function onMouseDown(_ref12) {
      var clientX = _ref12.clientX,
          clientY = _ref12.clientY;

      var _selectItem = selectItem(THREE, componentName, camera, clientX, clientY),
          depth = _selectItem.depth,
          offset = _selectItem.offset,
          element = _selectItem.element;

      if (element) {
        (function () {
          // Can only drag one item at a time, so no need to check if any
          // listener is already set up
          var removeDragItemListeners = dragItem(THREE, element, offset, camera, depth, {
            clientX: clientX,
            clientY: clientY
          });

          draggedElement = element;

          dragInfo = {
            offset: { x: offset.x, y: offset.y, z: offset.z },
            depth: depth,
            clientX: clientX,
            clientY: clientY
          };

          element.addEventListener(DRAG_MOVE_EVENT, onDragged);

          removeDragListeners = function removeDragListeners(_) {
            element.removeEventListener(DRAG_MOVE_EVENT, onDragged);
            // eslint-disable-next-line no-unused-expressions
            removeDragItemListeners && removeDragItemListeners();
            // in case this removal function gets called more than once
            removeDragItemListeners = null;
          };

          element.emit(DRAG_START_EVENT, dragInfo);
        })();
      }
    }

    function fitLineToVelocity(dimension) {

      if (positionLog.length < 2) {
        return 0;
      }

      var velocities = positionLog

      // Pull out just the x, y, or z values
      .map(function (log) {
        return { time: log.time, value: log.position[dimension] };
      })

      // Then convert that into an array of array pairs [time, value]
      .reduce(function (memo, log, index, collection) {

        // skip the first item (we're looking for pairs)
        if (index === 0) {
          return memo;
        }

        var deltaPosition = log.value - collection[index - 1].value;
        var deltaTime = (log.time - collection[index - 1].time) / 1000;

        // The new value is the change in position
        memo.push([log.time, deltaPosition / deltaTime]);

        return memo;
      }, []);

      // Calculate the line function
      var lineFunction = (0, _linear_regression_line2.default)((0, _linear_regression2.default)(velocities));

      // Calculate what the point was at the end of the line
      // ie; the velocity at the time the drag stopped
      return lineFunction(positionLog[positionLog.length - 1].time);
    }

    function onMouseUp(_ref13) {
      var clientX = _ref13.clientX,
          clientY = _ref13.clientY;


      if (!draggedElement) {
        return;
      }

      cleanUpPositionLog();

      var velocity = {
        x: fitLineToVelocity('x'),
        y: fitLineToVelocity('y'),
        z: fitLineToVelocity('z')
      };

      draggedElement.emit(DRAG_END_EVENT, Object.assign({}, dragInfo, { clientX: clientX, clientY: clientY, velocity: velocity }));

      removeDragListeners && removeDragListeners(); // eslint-disable-line no-unused-expressions
      removeDragListeners = undefined;
    }

    function onTouchStart(_ref14) {
      var _ref14$changedTouches = _slicedToArray(_ref14.changedTouches, 1),
          touchInfo = _ref14$changedTouches[0];

      onMouseDown(touchInfo);
    }

    function onTouchEnd(_ref15) {
      var _ref15$changedTouches = _slicedToArray(_ref15.changedTouches, 1),
          touchInfo = _ref15$changedTouches[0];

      onMouseUp(touchInfo);
    }

    function run() {

      camera = scene.camera.el;

      // TODO: Attach to canvas?
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);

      document.addEventListener('touchstart', onTouchStart);
      document.addEventListener('touchend', onTouchEnd);

      removeClickListeners = function removeClickListeners(_) {
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mouseup', onMouseUp);

        document.removeEventListener('touchstart', onTouchStart);
        document.removeEventListener('touchend', onTouchEnd);
      };
    }

    if (scene.hasLoaded) {
      run();
    } else {
      scene.addEventListener('loaded', run);
    }
  }

  function tearDown() {
    removeClickListeners && removeClickListeners(); // eslint-disable-line no-unused-expressions
    removeClickListeners = undefined;
  }

  return {
    didMount: function didMount(element, THREE, componentName) {

      if (cache.length === 0) {
        initialize(THREE, componentName);
      }

      if (cache.indexOf(element) === -1) {
        cache.push(element);
      }
    },
    didUnmount: function didUnmount(element) {

      var cacheIndex = cache.indexOf(element);

      removeDragListeners && removeDragListeners(); // eslint-disable-line no-unused-expressions
      removeDragListeners = undefined;

      if (cacheIndex === -1) {
        return;
      }

      // remove that element
      cache.splice(cacheIndex, 1);

      if (cache.length === 0) {
        tearDown();
      }
    }
  };
}(),
    didMount = _ref10.didMount,
    didUnmount = _ref10.didUnmount;

/**
 * @param aframe {Object} The Aframe instance to register with
 * @param componentName {String} The component name to use. Default: 'click-drag'
 */


function aframeDraggableComponent(aframe) {
  var componentName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : COMPONENT_NAME;


  var THREE = aframe.THREE;

  /**
   * Draggable component for A-Frame.
   */
  aframe.registerComponent(componentName, {
    schema: {},

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init: function init() {
      didMount(this, THREE, componentName);
    },


    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     *
     * @param oldData
     */
    update: function update() {},


    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
    remove: function remove() {
      didUnmount(this);
    },


    /**
     * Called when entity pauses.
     * Use to stop or remove any dynamic or background behavior such as events.
     */
    pause: function pause() {
      didUnmount(this);
    },


    /**
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     */
    play: function play() {
      didMount(this, THREE, componentName);
    }
  });
}
