(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("aframe"), require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["aframe", "three"], factory);
	else if(typeof exports === 'object')
		exports["ARjs"] = factory(require("aframe"), require("three"));
	else
		root["ARjs"] = factory(root["AFRAME"], root["THREE"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_aframe__, __WEBPACK_EXTERNAL_MODULE_three__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./aframe/src/location-based/ArjsDeviceOrientationControls.js":
/*!********************************************************************!*\
  !*** ./aframe/src/location-based/ArjsDeviceOrientationControls.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);

/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

/* NOTE that this is a modified version of THREE.DeviceOrientationControls to 
 * allow exponential smoothing, for use in AR.js.
 *
 * Modifications Nick Whitelegg (nickw1 github)
 */



const ArjsDeviceOrientationControls = function ( object ) {

  var scope = this;

  this.object = object;
  this.object.rotation.reorder( 'YXZ' );

  this.enabled = true;

  this.deviceOrientation = {};
  this.screenOrientation = 0;

  this.alphaOffset = 0; // radians

  this.smoothingFactor = 1;

  this.TWO_PI = 2 * Math.PI;
  this.HALF_PI = 0.5 * Math.PI;

  var onDeviceOrientationChangeEvent = function ( event ) {

    scope.deviceOrientation = event;

  };

  var onScreenOrientationChangeEvent = function () {

    scope.screenOrientation = window.orientation || 0;

  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  var setObjectQuaternion = function () {

    var zee = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3( 0, 0, 1 );

    var euler = new three__WEBPACK_IMPORTED_MODULE_0__.Euler();

    var q0 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();

    var q1 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

    return function ( quaternion, alpha, beta, gamma, orient ) {

      euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler( euler ); // orient the device

      quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

      quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

    };

  }();

  this.connect = function () {
 
    onScreenOrientationChangeEvent();

    window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
    window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    scope.enabled = true;

  };

  this.disconnect = function () {

    window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
    window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    scope.enabled = false;

  };

  this.update = function () {

    if ( scope.enabled === false ) return;

    var device = scope.deviceOrientation;

    if ( device ) {

      var alpha = device.alpha ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad( device.alpha ) + scope.alphaOffset : 0; // Z

      var beta = device.beta ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad( device.beta ) : 0; // X'

      var gamma = device.gamma ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad( device.gamma ) : 0; // Y''

      var orient = scope.screenOrientation ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad( scope.screenOrientation ) : 0; // O

      // NW Added smoothing code
      var k = this.smoothingFactor;

      if(this.lastOrientation) {
        alpha = this._getSmoothedAngle(alpha, this.lastOrientation.alpha, k);
        beta = this._getSmoothedAngle(beta + Math.PI, this.lastOrientation.beta, k);
        gamma = this._getSmoothedAngle(gamma + this.HALF_PI, this.lastOrientation.gamma, k, Math.PI);
    
      } else {
        beta += Math.PI;
        gamma += this.HALF_PI;
      }

      this.lastOrientation = {
        alpha: alpha,
        beta: beta,
        gamma: gamma
      };
      setObjectQuaternion( scope.object.quaternion, alpha, beta - Math.PI, gamma - this.HALF_PI, orient );

    }
  };

   
   // NW Added
  this._orderAngle = function(a, b, range = this.TWO_PI) {
    if ((b > a && Math.abs(b - a) < range / 2) || (a > b && Math.abs(b - a) > range / 2)) {
      return { left: a, right: b }
    } else { 
      return { left: b, right: a }
    }
  };

   // NW Added
  this._getSmoothedAngle = function(a, b, k, range = this.TWO_PI) {
    const angles = this._orderAngle(a, b, range);
    const angleshift = angles.left;
    const origAnglesRight = angles.right;
    angles.left = 0;
    angles.right -= angleshift;
    if(angles.right < 0) angles.right += range;
    let newangle = origAnglesRight == b ? (1 - k)*angles.right + k * angles.left : k * angles.right + (1 - k) * angles.left;
    newangle += angleshift;
    if(newangle >= range) newangle -= range;
    return newangle;
  };

  this.dispose = function () {
    scope.disconnect();
  };

  this.connect();

};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ArjsDeviceOrientationControls);


/***/ }),

/***/ "./aframe/src/location-based/arjs-look-controls.js":
/*!*********************************************************!*\
  !*** ./aframe/src/location-based/arjs-look-controls.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ArjsDeviceOrientationControls */ "./aframe/src/location-based/ArjsDeviceOrientationControls.js");
// To avoid recalculation at every mouse movement tick
var PI_2 = Math.PI / 2;


/**
 * look-controls. Update entity pose, factoring mouse, touch, and WebVR API data.
 */

/* NOTE that this is a modified version of A-Frame's look-controls to 
 * allow exponential smoothing, for use in AR.js.
 *
 * Modifications Nick Whitelegg (nickw1 github)
 */




aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('arjs-look-controls', {
  dependencies: ['position', 'rotation'],

  schema: {
    enabled: {default: true},
    magicWindowTrackingEnabled: {default: true},
    pointerLockEnabled: {default: false},
    reverseMouseDrag: {default: false},
    reverseTouchDrag: {default: false},
    touchEnabled: {default: true},
    smoothingFactor: { type: 'number', default: 1 }
  },

  init: function () {
    this.deltaYaw = 0;
    this.previousHMDPosition = new THREE.Vector3();
    this.hmdQuaternion = new THREE.Quaternion();
    this.magicWindowAbsoluteEuler = new THREE.Euler();
    this.magicWindowDeltaEuler = new THREE.Euler();
    this.position = new THREE.Vector3();
    this.magicWindowObject = new THREE.Object3D();
    this.rotation = {};
    this.deltaRotation = {};
    this.savedPose = null;
    this.pointerLocked = false;
    this.setupMouseControls();
    this.bindMethods();
    this.previousMouseEvent = {};

    this.setupMagicWindowControls();

    // To save / restore camera pose
    this.savedPose = {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler()
    };

    // Call enter VR handler if the scene has entered VR before the event listeners attached.
    if (this.el.sceneEl.is('vr-mode')) { this.onEnterVR(); }
  },

  setupMagicWindowControls: function () {
    var magicWindowControls;
    var data = this.data;

    // Only on mobile devices and only enabled if DeviceOrientation permission has been granted.
    if (aframe__WEBPACK_IMPORTED_MODULE_0__.utils.device.isMobile()) {
      magicWindowControls = this.magicWindowControls = new _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_1__.default(this.magicWindowObject);
      if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) {
        magicWindowControls.enabled = false;
        if (this.el.sceneEl.components['device-orientation-permission-ui'].permissionGranted) {
          magicWindowControls.enabled = data.magicWindowTrackingEnabled;
        } else {
          this.el.sceneEl.addEventListener('deviceorientationpermissiongranted', function () {
            magicWindowControls.enabled = data.magicWindowTrackingEnabled;
          });
        }
      }
    }
  },

  update: function (oldData) {
    var data = this.data;

    // Disable grab cursor classes if no longer enabled.
    if (data.enabled !== oldData.enabled) {
      this.updateGrabCursor(data.enabled);
    }

    // Reset magic window eulers if tracking is disabled.
    if (oldData && !data.magicWindowTrackingEnabled && oldData.magicWindowTrackingEnabled) {
      this.magicWindowAbsoluteEuler.set(0, 0, 0);
      this.magicWindowDeltaEuler.set(0, 0, 0);
    }

    // Pass on magic window tracking setting to magicWindowControls.
    if (this.magicWindowControls) {
      this.magicWindowControls.enabled = data.magicWindowTrackingEnabled;
      this.magicWindowControls.smoothingFactor = data.smoothingFactor;
    }

    if (oldData && !data.pointerLockEnabled !== oldData.pointerLockEnabled) {
      this.removeEventListeners();
      this.addEventListeners();
      if (this.pointerLocked) { this.exitPointerLock(); }
    }
  },

  tick: function (t) {
    var data = this.data;
    if (!data.enabled) { return; }
    this.updateOrientation();
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
    if (this.pointerLocked) { this.exitPointerLock(); }
  },

  remove: function () {
    this.removeEventListeners();
    if (this.pointerLocked) { this.exitPointerLock(); }
  },

  bindMethods: function () {
    this.onMouseDown = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseDown, this);
    this.onMouseMove = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseMove, this);
    this.onMouseUp = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseUp, this);
    this.onTouchStart = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchStart, this);
    this.onTouchMove = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchMove, this);
    this.onTouchEnd = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchEnd, this);
    this.onEnterVR = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onEnterVR, this);
    this.onExitVR = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onExitVR, this);
    this.onPointerLockChange = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onPointerLockChange, this);
    this.onPointerLockError = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onPointerLockError, this);
  },

 /**
  * Set up states and Object3Ds needed to store rotation data.
  */
  setupMouseControls: function () {
    this.mouseDown = false;
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 10;
    this.yawObject.add(this.pitchObject);
  },

  /**
   * Add mouse and touch event listeners to canvas.
   */
  addEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl.canvas;

    // Wait for canvas to load.
    if (!canvasEl) {
      sceneEl.addEventListener('render-target-loaded', aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.addEventListeners, this));
      return;
    }

    // Mouse events.
    canvasEl.addEventListener('mousedown', this.onMouseDown, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('mouseup', this.onMouseUp, false);

    // Touch events.
    canvasEl.addEventListener('touchstart', this.onTouchStart);
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);

    // sceneEl events.
    sceneEl.addEventListener('enter-vr', this.onEnterVR);
    sceneEl.addEventListener('exit-vr', this.onExitVR);

    // Pointer Lock events.
    if (this.data.pointerLockEnabled) {
      document.addEventListener('pointerlockchange', this.onPointerLockChange, false);
      document.addEventListener('mozpointerlockchange', this.onPointerLockChange, false);
      document.addEventListener('pointerlockerror', this.onPointerLockError, false);
    }
  },

  /**
   * Remove mouse and touch event listeners from canvas.
   */
  removeEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl && sceneEl.canvas;

    if (!canvasEl) { return; }

    // Mouse events.
    canvasEl.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);

    // Touch events.
    canvasEl.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    // sceneEl events.
    sceneEl.removeEventListener('enter-vr', this.onEnterVR);
    sceneEl.removeEventListener('exit-vr', this.onExitVR);

    // Pointer Lock events.
    document.removeEventListener('pointerlockchange', this.onPointerLockChange, false);
    document.removeEventListener('mozpointerlockchange', this.onPointerLockChange, false);
    document.removeEventListener('pointerlockerror', this.onPointerLockError, false);
  },

  /**
   * Update orientation for mobile, mouse drag, and headset.
   * Mouse-drag only enabled if HMD is not active.
   */
  updateOrientation: (function () {
    var poseMatrix = new THREE.Matrix4();

    return function () {
      var object3D = this.el.object3D;
      var pitchObject = this.pitchObject;
      var yawObject = this.yawObject;
      var pose;
      var sceneEl = this.el.sceneEl;

      // In VR mode, THREE is in charge of updating the camera pose.
      if (sceneEl.is('vr-mode') && sceneEl.checkHeadsetConnected()) {
        // With WebXR THREE applies headset pose to the object3D matrixWorld internally.
        // Reflect values back on position, rotation, scale for getAttribute to return the expected values.
        if (sceneEl.hasWebXR) {
          pose = sceneEl.renderer.xr.getCameraPose();
          if (pose) {
            poseMatrix.elements = pose.transform.matrix;
            poseMatrix.decompose(object3D.position, object3D.rotation, object3D.scale);
          }
        }
        return;
      }

      this.updateMagicWindowOrientation();

      // On mobile, do camera rotation with touch events and sensors.
      object3D.rotation.x = this.magicWindowDeltaEuler.x + pitchObject.rotation.x;
      object3D.rotation.y = this.magicWindowDeltaEuler.y + yawObject.rotation.y;
      object3D.rotation.z = this.magicWindowDeltaEuler.z;
    };
  })(),

  updateMagicWindowOrientation: function () {
    var magicWindowAbsoluteEuler = this.magicWindowAbsoluteEuler;
    var magicWindowDeltaEuler = this.magicWindowDeltaEuler;
    // Calculate magic window HMD quaternion.
    if (this.magicWindowControls && this.magicWindowControls.enabled) {
      this.magicWindowControls.update();
      magicWindowAbsoluteEuler.setFromQuaternion(this.magicWindowObject.quaternion, 'YXZ');
      if (!this.previousMagicWindowYaw && magicWindowAbsoluteEuler.y !== 0) {
        this.previousMagicWindowYaw = magicWindowAbsoluteEuler.y;
      }
      if (this.previousMagicWindowYaw) {
        magicWindowDeltaEuler.x = magicWindowAbsoluteEuler.x;
        magicWindowDeltaEuler.y += magicWindowAbsoluteEuler.y - this.previousMagicWindowYaw;
        magicWindowDeltaEuler.z = magicWindowAbsoluteEuler.z;
        this.previousMagicWindowYaw = magicWindowAbsoluteEuler.y;
      }
    }
  },

  /**
   * Translate mouse drag into rotation.
   *
   * Dragging up and down rotates the camera around the X-axis (yaw).
   * Dragging left and right rotates the camera around the Y-axis (pitch).
   */
  onMouseMove: function (evt) {
    var direction;
    var movementX;
    var movementY;
    var pitchObject = this.pitchObject;
    var previousMouseEvent = this.previousMouseEvent;
    var yawObject = this.yawObject;

    // Not dragging or not enabled.
    if (!this.data.enabled || (!this.mouseDown && !this.pointerLocked)) { return; }

    // Calculate delta.
    if (this.pointerLocked) {
      movementX = evt.movementX || evt.mozMovementX || 0;
      movementY = evt.movementY || evt.mozMovementY || 0;
    } else {
      movementX = evt.screenX - previousMouseEvent.screenX;
      movementY = evt.screenY - previousMouseEvent.screenY;
    }
    this.previousMouseEvent.screenX = evt.screenX;
    this.previousMouseEvent.screenY = evt.screenY;

    // Calculate rotation.
    direction = this.data.reverseMouseDrag ? 1 : -1;
    yawObject.rotation.y += movementX * 0.002 * direction;
    pitchObject.rotation.x += movementY * 0.002 * direction;
    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
  },

  /**
   * Register mouse down to detect mouse drag.
   */
  onMouseDown: function (evt) {
    var sceneEl = this.el.sceneEl;
    if (!this.data.enabled || (sceneEl.is('vr-mode') && sceneEl.checkHeadsetConnected())) { return; }
    // Handle only primary button.
    if (evt.button !== 0) { return; }

    var canvasEl = sceneEl && sceneEl.canvas;

    this.mouseDown = true;
    this.previousMouseEvent.screenX = evt.screenX;
    this.previousMouseEvent.screenY = evt.screenY;
    this.showGrabbingCursor();

    if (this.data.pointerLockEnabled && !this.pointerLocked) {
      if (canvasEl.requestPointerLock) {
        canvasEl.requestPointerLock();
      } else if (canvasEl.mozRequestPointerLock) {
        canvasEl.mozRequestPointerLock();
      }
    }
  },

  /**
   * Shows grabbing cursor on scene
   */
  showGrabbingCursor: function () {
    this.el.sceneEl.canvas.style.cursor = 'grabbing';
  },

  /**
   * Hides grabbing cursor on scene
   */
  hideGrabbingCursor: function () {
    this.el.sceneEl.canvas.style.cursor = '';
  },

  /**
   * Register mouse up to detect release of mouse drag.
   */
  onMouseUp: function () {
    this.mouseDown = false;
    this.hideGrabbingCursor();
  },

  /**
   * Register touch down to detect touch drag.
   */
  onTouchStart: function (evt) {
    if (evt.touches.length !== 1 ||
        !this.data.touchEnabled ||
        this.el.sceneEl.is('vr-mode')) { return; }
    this.touchStart = {
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY
    };
    this.touchStarted = true;
  },

  /**
   * Translate touch move to Y-axis rotation.
   */
  onTouchMove: function (evt) {
    var direction;
    var canvas = this.el.sceneEl.canvas;
    var deltaY;
    var yawObject = this.yawObject;

    if (!this.touchStarted || !this.data.touchEnabled) { return; }

    deltaY = 2 * Math.PI * (evt.touches[0].pageX - this.touchStart.x) / canvas.clientWidth;

    direction = this.data.reverseTouchDrag ? 1 : -1;
    // Limit touch orientaion to to yaw (y axis).
    yawObject.rotation.y -= deltaY * 0.5 * direction;
    this.touchStart = {
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY
    };
  },

  /**
   * Register touch end to detect release of touch drag.
   */
  onTouchEnd: function () {
    this.touchStarted = false;
  },

  /**
   * Save pose.
   */
  onEnterVR: function () {
    var sceneEl = this.el.sceneEl;
    if (!sceneEl.checkHeadsetConnected()) { return; }
    this.saveCameraPose();
    this.el.object3D.position.set(0, 0, 0);
    this.el.object3D.rotation.set(0, 0, 0);
    if (sceneEl.hasWebXR) {
      this.el.object3D.matrixAutoUpdate = false;
      this.el.object3D.updateMatrix();
    }
  },

  /**
   * Restore the pose.
   */
  onExitVR: function () {
    if (!this.el.sceneEl.checkHeadsetConnected()) { return; }
    this.restoreCameraPose();
    this.previousHMDPosition.set(0, 0, 0);
    this.el.object3D.matrixAutoUpdate = true;
  },

  /**
   * Update Pointer Lock state.
   */
  onPointerLockChange: function () {
    this.pointerLocked = !!(document.pointerLockElement || document.mozPointerLockElement);
  },

  /**
   * Recover from Pointer Lock error.
   */
  onPointerLockError: function () {
    this.pointerLocked = false;
  },

  // Exits pointer-locked mode.
  exitPointerLock: function () {
    document.exitPointerLock();
    this.pointerLocked = false;
  },

  /**
   * Toggle the feature of showing/hiding the grab cursor.
   */
  updateGrabCursor: function (enabled) {
    var sceneEl = this.el.sceneEl;

    function enableGrabCursor () { sceneEl.canvas.classList.add('a-grab-cursor'); }
    function disableGrabCursor () { sceneEl.canvas.classList.remove('a-grab-cursor'); }

    if (!sceneEl.canvas) {
      if (enabled) {
        sceneEl.addEventListener('render-target-loaded', enableGrabCursor);
      } else {
        sceneEl.addEventListener('render-target-loaded', disableGrabCursor);
      }
      return;
    }

    if (enabled) {
      enableGrabCursor();
      return;
    }
    disableGrabCursor();
  },

  /**
   * Save camera pose before entering VR to restore later if exiting.
   */
  saveCameraPose: function () {
    var el = this.el;

    this.savedPose.position.copy(el.object3D.position);
    this.savedPose.rotation.copy(el.object3D.rotation);
    this.hasSavedPose = true;
  },

  /**
   * Reset camera pose to before entering VR.
   */
  restoreCameraPose: function () {
    var el = this.el;
    var savedPose = this.savedPose;

    if (!this.hasSavedPose) { return; }

    // Reset camera orientation.
    el.object3D.position.copy(savedPose.position);
    el.object3D.rotation.copy(savedPose.rotation);
    this.hasSavedPose = false;
  }
});


/***/ }),

/***/ "./aframe/src/location-based/arjs-webcam-texture.js":
/*!**********************************************************!*\
  !*** ./aframe/src/location-based/arjs-webcam-texture.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_1__);



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('arjs-webcam-texture', {

    init: function() {
        this.scene = this.el.sceneEl;
        this.texCamera = new three__WEBPACK_IMPORTED_MODULE_1__.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10);
        this.texScene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();

        this.scene.renderer.autoClear = false;
        this.video = document.createElement("video");
        this.video.setAttribute("autoplay", true);
        this.video.setAttribute("display", "none");
        document.body.appendChild(this.video);
        this.geom = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneBufferGeometry(); //0.5, 0.5);
        this.texture = new three__WEBPACK_IMPORTED_MODULE_1__.VideoTexture(this.video);
        this.material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial( { map: this.texture } );
        const mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(this.geom, this.material);
        this.texScene.add(mesh);
    },

    play: function() {
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const constraints = { video: {
                facingMode: 'environment' }
            };
            navigator.mediaDevices.getUserMedia(constraints).then( stream=> {
                this.video.srcObject = stream;    
                this.video.play();
            })
            .catch(e => { alert(`Webcam error: ${e}`); });
        } else {
            alert('sorry - media devices API not supported');
        }
    },

    tick: function() {
        this.scene.renderer.clear();
        this.scene.renderer.render(this.texScene, this.texCamera);
        this.scene.renderer.clearDepth();
    },

    pause: function() {
        this.video.srcObject.getTracks().forEach ( track => {
            track.stop();
        });
    },

    remove: function() {
        this.material.dispose();
        this.texture.dispose();
        this.geom.dispose();
    }
});


/***/ }),

/***/ "./aframe/src/location-based/gps-camera.js":
/*!*************************************************!*\
  !*** ./aframe/src/location-based/gps-camera.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_1__);
/*
 * UPDATES 28/08/20:
 *
 * - add gpsMinDistance and gpsTimeInterval properties to control how
 * frequently GPS updates are processed. Aim is to prevent 'stuttering'
 * effects when close to AR content due to continuous small changes in
 * location.
 */




aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('gps-camera', {
    _watchPositionId: null,
    originCoords: null,
    currentCoords: null,
    lookControls: null,
    heading: null,
    schema: {
        simulateLatitude: {
            type: 'number',
            default: 0,
        },
        simulateLongitude: {
            type: 'number',
            default: 0,
        },
        simulateAltitude: {
            type: 'number',
            default: 0,
        },
        positionMinAccuracy: {
            type: 'int',
            default: 100,
        },
        alert: {
            type: 'boolean',
            default: false,
        },
        minDistance: {
            type: 'int',
            default: 0,
        },
        maxDistance: {
            type: 'int',
            default: 0,
        },
        gpsMinDistance: {
            type: 'number',
            default: 5,
        },
        gpsTimeInterval: {
            type: 'number',
            default: 0,
        },
    },
    update: function() {
        if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
            var localPosition = Object.assign({}, this.currentCoords || {});
            localPosition.longitude = this.data.simulateLongitude;
            localPosition.latitude = this.data.simulateLatitude;
            localPosition.altitude = this.data.simulateAltitude;
            this.currentCoords = localPosition;

            // re-trigger initialization for new origin
            this.originCoords = null;
            this._updatePosition();
        }
    },
    init: function () {
        if (!this.el.components['arjs-look-controls'] && !this.el.components['look-controls']) {
            return;
        }

        this.lastPosition = {
            latitude: 0,
            longitude: 0
        };

        this.loader = document.createElement('DIV');
        this.loader.classList.add('arjs-loader');
        document.body.appendChild(this.loader);

        this.onGpsEntityPlaceAdded = this._onGpsEntityPlaceAdded.bind(this);
        window.addEventListener('gps-entity-place-added', this.onGpsEntityPlaceAdded);

        this.lookControls = this.el.components['arjs-look-controls'] || this.el.components['look-controls'];

        // listen to deviceorientation event
        var eventName = this._getDeviceOrientationEventName();
        this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

        // if Safari
        if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
            // iOS 13+
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                var handler = function () {
                    console.log('Requesting device orientation permissions...')
                    DeviceOrientationEvent.requestPermission();
                    document.removeEventListener('touchend', handler);
                };

                document.addEventListener('touchend', function () { handler() }, false);

                alert('After camera permission prompt, please tap the screen to activate geolocation.');
            } else {
                var timeout = setTimeout(function () {
                    alert('Please enable device orientation in Settings > Safari > Motion & Orientation Access.')
                }, 750);
                window.addEventListener(eventName, function () {
                    clearTimeout(timeout);
                });
            }
        }

        window.addEventListener(eventName, this._onDeviceOrientation, false);

        this._watchPositionId = this._initWatchGPS(function (position) {
            var localPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                altitude: position.coords.altitude,
                accuracy: position.coords.accuracy,
                altitudeAccuracy: position.coords.altitudeAccuracy,
            };

            if (this.data.simulateAltitude !== 0) {
                localPosition.altitude = this.data.simulateAltitude;
            }
            if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
                localPosition.latitude = this.data.simulateLatitude;
                localPosition.longitude = this.data.simulateLongitude;
                this.currentCoords = localPosition;
                this._updatePosition();
            } else {
                this.currentCoords = localPosition;
                var distMoved = this._haversineDist(
                    this.lastPosition,
                    this.currentCoords
                );

                if(distMoved >= this.data.gpsMinDistance || !this.originCoords) {
                    this._updatePosition();
                    this.lastPosition = {
                        longitude: this.currentCoords.longitude,
                        latitude: this.currentCoords.latitude
                    };
                }
            }
        }.bind(this));
    },

    tick: function () {
        if (this.heading === null) {
            return;
        }
        this._updateRotation();
    },

    remove: function () {
        if (this._watchPositionId) {
            navigator.geolocation.clearWatch(this._watchPositionId);
        }
        this._watchPositionId = null;

        var eventName = this._getDeviceOrientationEventName();
        window.removeEventListener(eventName, this._onDeviceOrientation, false);
        window.removeEventListener('gps-entity-place-added', this.onGpsEntityPlaceAdded);
    },

    /**
     * Get device orientation event name, depends on browser implementation.
     * @returns {string} event name
     */
    _getDeviceOrientationEventName: function () {
        if ('ondeviceorientationabsolute' in window) {
            var eventName = 'deviceorientationabsolute'
        } else if ('ondeviceorientation' in window) {
            var eventName = 'deviceorientation'
        } else {
            var eventName = ''
            console.error('Compass not supported')
        }

        return eventName
    },

    /**
     * Get current user position.
     *
     * @param {function} onSuccess
     * @param {function} onError
     * @returns {Promise}
     */
    _initWatchGPS: function (onSuccess, onError) {
        if (!onError) {
            onError = function (err) {
                console.warn('ERROR(' + err.code + '): ' + err.message)

                if (err.code === 1) {
                    // User denied GeoLocation, let their know that
                    alert('Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website.');
                    return;
                }

                if (err.code === 3) {
                    alert('Cannot retrieve GPS position. Signal is absent.');
                    return;
                }
            };
        }

        if ('geolocation' in navigator === false) {
            onError({ code: 0, message: 'Geolocation is not supported by your browser' });
            return Promise.resolve();
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
        return navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            maximumAge: this.data.gpsTimeInterval,
            timeout: 27000,
        });
    },

    /**
     * Update user position.
     *
     * @returns {void}
     */
    _updatePosition: function () {
        // don't update if accuracy is not good enough
        if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
            if (this.data.alert && !document.getElementById('alert-popup')) {
                var popup = document.createElement('div');
                popup.innerHTML = 'GPS signal is very poor. Try move outdoor or to an area with a better signal.'
                popup.setAttribute('id', 'alert-popup');
                document.body.appendChild(popup);
            }
            return;
        }

        var alertPopup = document.getElementById('alert-popup');
        if (this.currentCoords.accuracy <= this.data.positionMinAccuracy && alertPopup) {
            document.body.removeChild(alertPopup);
        }

        if (!this.originCoords) {
            // first camera initialization
            this.originCoords = this.currentCoords;
            this._setPosition();

            var loader = document.querySelector('.arjs-loader');
            if (loader) {
                loader.remove();
            }
            window.dispatchEvent(new CustomEvent('gps-camera-origin-coord-set'));
        } else {
            this._setPosition();
        }
    },
    _setPosition: function () {
        var position = this.el.getAttribute('position');

        // compute position.x
        var dstCoords = {
            longitude: this.currentCoords.longitude,
            latitude: this.originCoords.latitude,
        };

        position.x = this.computeDistanceMeters(this.originCoords, dstCoords);
        position.x *= this.currentCoords.longitude > this.originCoords.longitude ? 1 : -1;

        // compute position.z
        var dstCoords = {
            longitude: this.originCoords.longitude,
            latitude: this.currentCoords.latitude,
        }

        position.z = this.computeDistanceMeters(this.originCoords, dstCoords);
        position.z *= this.currentCoords.latitude > this.originCoords.latitude ? -1 : 1;

        // update position
        this.el.setAttribute('position', position);

        window.dispatchEvent(new CustomEvent('gps-camera-update-position', { detail: { position: this.currentCoords, origin: this.originCoords } }));
    },
    /**
     * Returns distance in meters between source and destination inputs.
     *
     *  Calculate distance, bearing and more between Latitude/Longitude points
     *  Details: https://www.movable-type.co.uk/scripts/latlong.html
     *
     * @param {Position} src
     * @param {Position} dest
     * @param {Boolean} isPlace
     *
     * @returns {number} distance | Number.MAX_SAFE_INTEGER
     */
    computeDistanceMeters: function (src, dest, isPlace) {
        var distance = this._haversineDist (src, dest);

        // if function has been called for a place, and if it's too near and a min distance has been set,
        // return max distance possible - to be handled by the caller
        if (isPlace && this.data.minDistance && this.data.minDistance > 0 && distance < this.data.minDistance) {
            return Number.MAX_SAFE_INTEGER;
        }

        // if function has been called for a place, and if it's too far and a max distance has been set,
        // return max distance possible - to be handled by the caller
        if (isPlace && this.data.maxDistance && this.data.maxDistance > 0 && distance > this.data.maxDistance) {
            return Number.MAX_SAFE_INTEGER;
        }

        return distance;
    },

    _haversineDist: function (src, dest) {
        var dlongitude = three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(dest.longitude - src.longitude);
        var dlatitude = three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(dest.latitude - src.latitude);

        var a = (Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2)) + Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(src.latitude)) * Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(dest.latitude)) * (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
        var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return angle * 6371000;
    },

    /**
     * Compute compass heading.
     *
     * @param {number} alpha
     * @param {number} beta
     * @param {number} gamma
     *
     * @returns {number} compass heading
     */
    _computeCompassHeading: function (alpha, beta, gamma) {

        // Convert degrees to radians
        var alphaRad = alpha * (Math.PI / 180);
        var betaRad = beta * (Math.PI / 180);
        var gammaRad = gamma * (Math.PI / 180);

        // Calculate equation components
        var cA = Math.cos(alphaRad);
        var sA = Math.sin(alphaRad);
        var sB = Math.sin(betaRad);
        var cG = Math.cos(gammaRad);
        var sG = Math.sin(gammaRad);

        // Calculate A, B, C rotation components
        var rA = - cA * sG - sA * sB * cG;
        var rB = - sA * sG + cA * sB * cG;

        // Calculate compass heading
        var compassHeading = Math.atan(rA / rB);

        // Convert from half unit circle to whole unit circle
        if (rB < 0) {
            compassHeading += Math.PI;
        } else if (rA < 0) {
            compassHeading += 2 * Math.PI;
        }

        // Convert radians to degrees
        compassHeading *= 180 / Math.PI;

        return compassHeading;
    },

    /**
     * Handler for device orientation event.
     *
     * @param {Event} event
     * @returns {void}
     */
    _onDeviceOrientation: function (event) {
        if (event.webkitCompassHeading !== undefined) {
            if (event.webkitCompassAccuracy < 50) {
                this.heading = event.webkitCompassHeading;
            } else {
                console.warn('webkitCompassAccuracy is event.webkitCompassAccuracy');
            }
        } else if (event.alpha !== null) {
            if (event.absolute === true || event.absolute === undefined) {
                this.heading = this._computeCompassHeading(event.alpha, event.beta, event.gamma);
            } else {
                console.warn('event.absolute === false');
            }
        } else {
            console.warn('event.alpha === null');
        }
    },

    /**
     * Update user rotation data.
     *
     * @returns {void}
     */
    _updateRotation: function () {
        var heading = 360 - this.heading;
        var cameraRotation = this.el.getAttribute('rotation').y;
        var yawRotation = three__WEBPACK_IMPORTED_MODULE_1__.Math.radToDeg(this.lookControls.yawObject.rotation.y);
        var offset = (heading - (cameraRotation - yawRotation)) % 360;
        this.lookControls.yawObject.rotation.y = three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(offset);
    },

    _onGpsEntityPlaceAdded: function() {
        // if places are added after camera initialization is finished
        if (this.originCoords) {
            window.dispatchEvent(new CustomEvent('gps-camera-origin-coord-set'));
        }
        if (this.loader && this.loader.parentElement) {
            document.body.removeChild(this.loader)
        }
    }
});


/***/ }),

/***/ "./aframe/src/location-based/gps-entity-place.js":
/*!*******************************************************!*\
  !*** ./aframe/src/location-based/gps-entity-place.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('gps-entity-place', {
    _cameraGps: null,
    schema: {
        longitude: {
            type: 'number',
            default: 0,
        },
        latitude: {
            type: 'number',
            default: 0,
        }
    },
    remove: function() {
        // cleaning listeners when the entity is removed from the DOM
        window.removeEventListener('gps-camera-origin-coord-set', this.coordSetListener);
        window.removeEventListener('gps-camera-update-position', this.updatePositionListener);
    },
    init: function() {
        this.coordSetListener = () => {
            if (!this._cameraGps) {
                var camera = document.querySelector('[gps-camera]');
                if (!camera.components['gps-camera']) {
                    console.error('gps-camera not initialized')
                    return;
                }
                this._cameraGps = camera.components['gps-camera'];
            }
            this._updatePosition();
        };

        this.updatePositionListener = (ev) => {
            if (!this.data || !this._cameraGps) {
                return;
            }

            var dstCoords = {
                longitude: this.data.longitude,
                latitude: this.data.latitude,
            };

            // it's actually a 'distance place', but we don't call it with last param, because we want to retrieve distance even if it's < minDistance property
            var distanceForMsg = this._cameraGps.computeDistanceMeters(ev.detail.position, dstCoords);

            this.el.setAttribute('distance', distanceForMsg);
            this.el.setAttribute('distanceMsg', formatDistance(distanceForMsg));
            this.el.dispatchEvent(new CustomEvent('gps-entity-place-update-positon', { detail: { distance: distanceForMsg } }));

            var actualDistance = this._cameraGps.computeDistanceMeters(ev.detail.position, dstCoords, true);

            if (actualDistance === Number.MAX_SAFE_INTEGER) {
                this.hideForMinDistance(this.el, true);
            } else {
                this.hideForMinDistance(this.el, false);
            }
        };

        window.addEventListener('gps-camera-origin-coord-set', this.coordSetListener);
        window.addEventListener('gps-camera-update-position', this.updatePositionListener);

        this._positionXDebug = 0;

        window.dispatchEvent(new CustomEvent('gps-entity-place-added', { detail: { component: this.el } }));
    },
    /**
     * Hide entity according to minDistance property
     * @returns {void}
     */
    hideForMinDistance: function(el, hideEntity) {
        if (hideEntity) {
            el.setAttribute('visible', 'false');
        } else {
            el.setAttribute('visible', 'true');
        }
    },
    /**
     * Update place position
     * @returns {void}
     */
    _updatePosition: function() {
        var position = { x: 0, y: this.el.getAttribute('position').y || 0, z: 0 }

        // update position.x
        var dstCoords = {
            longitude: this.data.longitude,
            latitude: this._cameraGps.originCoords.latitude,
        };

        position.x = this._cameraGps.computeDistanceMeters(this._cameraGps.originCoords, dstCoords);

        this._positionXDebug = position.x;

        position.x *= this.data.longitude > this._cameraGps.originCoords.longitude ? 1 : -1;

        // update position.z
        var dstCoords = {
            longitude: this._cameraGps.originCoords.longitude,
            latitude: this.data.latitude,
        };

        position.z = this._cameraGps.computeDistanceMeters(this._cameraGps.originCoords, dstCoords);

        position.z *= this.data.latitude > this._cameraGps.originCoords.latitude ? -1 : 1;

        if (position.y !== 0) {
            var altitude = this._cameraGps.originCoords.altitude !== undefined ? this._cameraGps.originCoords.altitude : 0;
            position.y = position.y - altitude;
        }

        // update element's position in 3D world
        this.el.setAttribute('position', position);
    },
});

/**
 * Format distances string
 *
 * @param {String} distance
 */
function formatDistance(distance) {
    distance = distance.toFixed(0);

    if (distance >= 1000) {
        return (distance / 1000) + ' kilometers';
    }

    return distance + ' meters';
};


/***/ }),

/***/ "./aframe/src/location-based/gps-projected-camera.js":
/*!***********************************************************!*\
  !*** ./aframe/src/location-based/gps-projected-camera.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/** gps-projected-camera
 *
 * based on the original gps-camera, modified by nickw 02/04/20
 *
 * Rather than keeping track of position by calculating the distance of
 * entities or the current location to the original location, this version
 * makes use of the "Google" Spherical Mercactor projection, aka epsg:3857.
 *
 * The original position (lat/lon) is projected into Spherical Mercator and
 * stored.
 *
 * Then, when we receive a new position (lat/lon), this new position is
 * projected into Spherical Mercator and then its world position calculated
 * by comparing against the original position.
 *
 * The same is also the case for 'entity-places'; when these are added, their
 * Spherical Mercator coords are calculated (see gps-projected-entity-place).
 *
 * Spherical Mercator units are close to, but not exactly, metres, and are
 * heavily distorted near the poles. Nonetheless they are a good approximation
 * for many areas of the world and appear not to cause unacceptable distortions
 * when used as the units for AR apps.
 *
 * UPDATES 28/08/20:
 *
 * - add gpsMinDistance and gpsTimeInterval properties to control how
 * frequently GPS updates are processed. Aim is to prevent 'stuttering'
 * effects when close to AR content due to continuous small changes in
 * location.
 */



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('gps-projected-camera', {
    _watchPositionId: null,
    originCoords: null, // original coords now in Spherical Mercator
    currentCoords: null,
    lookControls: null,
    heading: null,
    schema: {
        simulateLatitude: {
            type: 'number',
            default: 0,
        },
        simulateLongitude: {
            type: 'number',
            default: 0,
        },
        simulateAltitude: {
            type: 'number',
            default: 0,
        },
        positionMinAccuracy: {
            type: 'int',
            default: 100,
        },
        alert: {
            type: 'boolean',
            default: false,
        },
        minDistance: {
            type: 'int',
            default: 0,
        },
        gpsMinDistance: {
            type: 'number',
            default: 0
        },
        gpsTimeInterval: {
            type: 'number',
            default: 0
        },
    },
    update: function() {
        if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
            var localPosition = Object.assign({}, this.currentCoords || {});
            localPosition.longitude = this.data.simulateLongitude;
            localPosition.latitude = this.data.simulateLatitude;
            localPosition.altitude = this.data.simulateAltitude;
            this.currentCoords = localPosition;

            // re-trigger initialization for new origin
            this.originCoords = null;
            this._updatePosition();
        }
    },
    init: function() {
        if (!this.el.components['arjs-look-controls'] && !this.el.components['look-controls']) {
            return;
        }

        this.lastPosition = {
            latitude: 0,
            longitude: 0
        };

        this.loader = document.createElement('DIV');
        this.loader.classList.add('arjs-loader');
        document.body.appendChild(this.loader);

        this.onGpsEntityPlaceAdded = this._onGpsEntityPlaceAdded.bind(this);
        window.addEventListener('gps-entity-place-added', this.onGpsEntityPlaceAdded);

        this.lookControls = this.el.components['arjs-look-controls'] || this.el.components['look-controls'];

        // listen to deviceorientation event
        var eventName = this._getDeviceOrientationEventName();
        this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

        // if Safari
        if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
            // iOS 13+
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                var handler = function() {
                    console.log('Requesting device orientation permissions...')
                    DeviceOrientationEvent.requestPermission();
                    document.removeEventListener('touchend', handler);
                };

                document.addEventListener('touchend', function() { handler() }, false);

                alert('After camera permission prompt, please tap the screen to activate geolocation.');
            } else {
                var timeout = setTimeout(function() {
                    alert('Please enable device orientation in Settings > Safari > Motion & Orientation Access.')
                }, 750);
                window.addEventListener(eventName, function() {
                    clearTimeout(timeout);
                });
            }
        }

        window.addEventListener(eventName, this._onDeviceOrientation, false);

        this._watchPositionId = this._initWatchGPS(function (position) {
            var localPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                altitude: position.coords.altitude,
                accuracy: position.coords.accuracy,
                altitudeAccuracy: position.coords.altitudeAccuracy,
            };

            if (this.data.simulateAltitude !== 0) {
                localPosition.altitude = this.data.simulateAltitude;
            }

            if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
                localPosition.latitude = this.data.simulateLatitude;
                localPosition.longitude = this.data.simulateLongitude;
                this.currentCoords = localPosition;
                this._updatePosition();
            } else {
                this.currentCoords = localPosition;
                var distMoved = this._haversineDist(
                    this.lastPosition,
                    this.currentCoords
                );

                if(distMoved >= this.data.gpsMinDistance || !this.originCoords) {
                    this._updatePosition();
                    this.lastPosition = {
                        longitude: this.currentCoords.longitude,
                        latitude: this.currentCoords.latitude
                    };
                }
            }
        }.bind(this));
    },

    tick: function() {
        if (this.heading === null) {
            return;
        }
        this._updateRotation();
    },

    remove: function() {
        if (this._watchPositionId) {
            navigator.geolocation.clearWatch(this._watchPositionId);
        }
        this._watchPositionId = null;

        var eventName = this._getDeviceOrientationEventName();
        window.removeEventListener(eventName, this._onDeviceOrientation, false);
        window.removeEventListener('gps-entity-place-added', this.onGpsEntityPlaceAdded);
    },

    /**
     * Get device orientation event name, depends on browser implementation.
     * @returns {string} event name
     */
    _getDeviceOrientationEventName: function() {
        if ('ondeviceorientationabsolute' in window) {
            var eventName = 'deviceorientationabsolute'
        } else if ('ondeviceorientation' in window) {
            var eventName = 'deviceorientation'
        } else {
            var eventName = ''
            console.error('Compass not supported')
        }

        return eventName
    },

    /**
     * Get current user position.
     *
     * @param {function} onSuccess
     * @param {function} onError
     * @returns {Promise}
     */
    _initWatchGPS: function(onSuccess, onError) {
        if (!onError) {
            onError = function(err) {
                console.warn('ERROR(' + err.code + '): ' + err.message)

                if (err.code === 1) {
                    // User denied GeoLocation, let their know that
                    alert('Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website.');
                    return;
                }

                if (err.code === 3) {
                    alert('Cannot retrieve GPS position. Signal is absent.');
                    return;
                }
            };
        }

        if ('geolocation' in navigator === false) {
            onError({ code: 0, message: 'Geolocation is not supported by your browser' });
            return Promise.resolve();
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
        return navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            maximumAge: this.data.gpsTimeInterval,
            timeout: 27000,
        });
    },

    /**
     * Update user position.
     *
     * @returns {void}
     */
    _updatePosition: function() {
        // don't update if accuracy is not good enough
        if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
            if (this.data.alert && !document.getElementById('alert-popup')) {
                var popup = document.createElement('div');
                popup.innerHTML = 'GPS signal is very poor. Try move outdoor or to an area with a better signal.'
                popup.setAttribute('id', 'alert-popup');
                document.body.appendChild(popup);
            }
            return;
        }

        var alertPopup = document.getElementById('alert-popup');
        if (this.currentCoords.accuracy <= this.data.positionMinAccuracy && alertPopup) {
            document.body.removeChild(alertPopup);
        }

        if (!this.originCoords) {
            // first camera initialization
            // Now store originCoords as PROJECTED original lat/lon, so that
            // we can set the world origin to the original position in "metres"
            this.originCoords = this._project(this.currentCoords.latitude, this.currentCoords.longitude);
            this._setPosition();

            var loader = document.querySelector('.arjs-loader');
            if (loader) {
                loader.remove();
            }
            window.dispatchEvent(new CustomEvent('gps-camera-origin-coord-set'));
        } else {
            this._setPosition();
        }
    },
    /**
     * Set the current position (in world coords, based on Spherical Mercator)
     *
     * @returns {void}
     */
    _setPosition: function() {
        var position = this.el.getAttribute('position');

        var worldCoords = this.latLonToWorld(this.currentCoords.latitude, this.currentCoords.longitude);

        position.x = worldCoords[0];
        position.z = worldCoords[1];

        // update position
        this.el.setAttribute('position', position);

        // add the sphmerc position to the event (for testing only)
        window.dispatchEvent(new CustomEvent('gps-camera-update-position', { detail: { position: this.currentCoords, origin: this.originCoords } }));
    },
    /**
     * Returns distance in meters between camera and destination input.
     *
     * Assume we are using a metre-based projection. Not all 'metre-based'
     * projections give exact metres, e.g. Spherical Mercator, but it appears
     * close enough to be used for AR at least in middle temperate
     * latitudes (40 - 55). It is heavily distorted near the poles, however.
     *
     * @param {Position} dest
     * @param {Boolean} isPlace
     *
     * @returns {number} distance | Number.MAX_SAFE_INTEGER
     */
    computeDistanceMeters: function(dest, isPlace) {
        var src = this.el.getAttribute("position");
        var dx = dest.x - src.x;
        var dz = dest.z - src.z;
        var distance = Math.sqrt(dx * dx + dz * dz);

        // if function has been called for a place, and if it's too near and a min distance has been set,
        // return max distance possible - to be handled by the  method caller
        if (isPlace && this.data.minDistance && this.data.minDistance > 0 && distance < this.data.minDistance) {
            return Number.MAX_SAFE_INTEGER;
        }

        return distance;
    },
    /**
     * Converts latitude/longitude to OpenGL world coordinates.
     *
     * First projects lat/lon to absolute Spherical Mercator and then
     * calculates the world coordinates by comparing the Spherical Mercator
     * coordinates with the Spherical Mercator coordinates of the origin point.
     *
     * @param {Number} lat
     * @param {Number} lon
     *
     * @returns {array} world coordinates
     */
    latLonToWorld: function(lat, lon) {
        var projected = this._project(lat, lon);
        // Sign of z needs to be reversed compared to projected coordinates
        return [ projected[0] - this.originCoords[0], -(projected[1] - this.originCoords[1])];
    },
    /**
     * Converts latitude/longitude to Spherical Mercator coordinates.
     * Algorithm is used in several OpenStreetMap-related applications.
     *
     * @param {Number} lat
     * @param {Number} lon
     *
     * @returns {array} Spherical Mercator coordinates
     */
    _project: function(lat, lon) {
        const HALF_EARTH = 20037508.34;

        // Convert the supplied coords to Spherical Mercator (EPSG:3857), also
        // known as 'Google Projection', using the algorithm used extensively
        // in various OpenStreetMap software.
        var y = Math.log(Math.tan((90 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0);
        return [(lon / 180.0) * HALF_EARTH, y * HALF_EARTH / 180.0];
    },
    /**
     * Converts Spherical Mercator coordinates to latitude/longitude.
     * Algorithm is used in several OpenStreetMap-related applications.
     *
     * @param {Number} spherical mercator easting
     * @param {Number} spherical mercator northing
     *
     * @returns {object} lon/lat
     */
    _unproject: function(e, n) {
        const HALF_EARTH = 20037508.34;
        var yp = (n / HALF_EARTH) * 180.0;
        return {
            longitude: (e / HALF_EARTH) * 180.0,
            latitude: 180.0 / Math.PI * (2 * Math.atan(Math.exp(yp * Math.PI / 180.0)) - Math.PI / 2)
        };
    },
    /**
     * Compute compass heading.
     *
     * @param {number} alpha
     * @param {number} beta
     * @param {number} gamma
     *
     * @returns {number} compass heading
     */
    _computeCompassHeading: function(alpha, beta, gamma) {

        // Convert degrees to radians
        var alphaRad = alpha * (Math.PI / 180);
        var betaRad = beta * (Math.PI / 180);
        var gammaRad = gamma * (Math.PI / 180);

        // Calculate equation components
        var cA = Math.cos(alphaRad);
        var sA = Math.sin(alphaRad);
        var sB = Math.sin(betaRad);
        var cG = Math.cos(gammaRad);
        var sG = Math.sin(gammaRad);

        // Calculate A, B, C rotation components
        var rA = - cA * sG - sA * sB * cG;
        var rB = - sA * sG + cA * sB * cG;

        // Calculate compass heading
        var compassHeading = Math.atan(rA / rB);

        // Convert from half unit circle to whole unit circle
        if (rB < 0) {
            compassHeading += Math.PI;
        } else if (rA < 0) {
            compassHeading += 2 * Math.PI;
        }

        // Convert radians to degrees
        compassHeading *= 180 / Math.PI;

        return compassHeading;
    },

    /**
     * Handler for device orientation event.
     *
     * @param {Event} event
     * @returns {void}
     */
    _onDeviceOrientation: function(event) {
        if (event.webkitCompassHeading !== undefined) {
            if (event.webkitCompassAccuracy < 50) {
                this.heading = event.webkitCompassHeading;
            } else {
                console.warn('webkitCompassAccuracy is event.webkitCompassAccuracy');
            }
        } else if (event.alpha !== null) {
            if (event.absolute === true || event.absolute === undefined) {
                this.heading = this._computeCompassHeading(event.alpha, event.beta, event.gamma);
            } else {
                console.warn('event.absolute === false');
            }
        } else {
            console.warn('event.alpha === null');
        }
    },

    /**
     * Update user rotation data.
     *
     * @returns {void}
     */
    _updateRotation: function() {
        var heading = 360 - this.heading;
        var cameraRotation = this.el.getAttribute('rotation').y;
        var yawRotation = THREE.Math.radToDeg(this.lookControls.yawObject.rotation.y);
        var offset = (heading - (cameraRotation - yawRotation)) % 360;
        this.lookControls.yawObject.rotation.y = THREE.Math.degToRad(offset);
    },

    /**
     * Calculate haversine distance between two lat/lon pairs.
     *
     * Taken from gps-camera
     */
     _haversineDist: function(src, dest) {
        var dlongitude = THREE.Math.degToRad(dest.longitude - src.longitude);
        var dlatitude = THREE.Math.degToRad(dest.latitude - src.latitude);

        var a = (Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2)) + Math.cos(THREE.Math.degToRad(src.latitude)) * Math.cos(THREE.Math.degToRad(dest.latitude)) * (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
        var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return angle * 6371000;
    },

    _onGpsEntityPlaceAdded: function() {
        // if places are added after camera initialization is finished
        if (this.originCoords) {
            window.dispatchEvent(new CustomEvent('gps-camera-origin-coord-set'));
        }
        if (this.loader && this.loader.parentElement) {
            document.body.removeChild(this.loader)
        }
    }
});


/***/ }),

/***/ "./aframe/src/location-based/gps-projected-entity-place.js":
/*!*****************************************************************!*\
  !*** ./aframe/src/location-based/gps-projected-entity-place.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/** gps-projected-entity-place
 *
 * based on the original gps-entity-place, modified by nickw 02/04/20
 *
 * Rather than keeping track of position by calculating the distance of
 * entities or the current location to the original location, this version
 * makes use of the "Google" Spherical Mercactor projection, aka epsg:3857.
 *
 * The original location on startup (lat/lon) is projected into Spherical 
 * Mercator and stored.
 *
 * When 'entity-places' are added, their Spherical Mercator coords are 
 * calculated and converted into world coordinates, relative to the original
 * position, using the Spherical Mercator projection calculation in
 * gps-projected-camera.
 *
 * Spherical Mercator units are close to, but not exactly, metres, and are
 * heavily distorted near the poles. Nonetheless they are a good approximation
 * for many areas of the world and appear not to cause unacceptable distortions
 * when used as the units for AR apps.
 */


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent('gps-projected-entity-place', {
    _cameraGps: null,
    schema: {
        longitude: {
            type: 'number',
            default: 0,
        },
        latitude: {
            type: 'number',
            default: 0,
        }
    },
    remove: function() {
        // cleaning listeners when the entity is removed from the DOM
        window.removeEventListener('gps-camera-update-position', this.updatePositionListener);
    },
    init: function() {
        // Used now to get the GPS camera when it's been setup
        this.coordSetListener = () => {
            if (!this._cameraGps) {
                var camera = document.querySelector('[gps-projected-camera]');
                if (!camera.components['gps-projected-camera']) {
                    console.error('gps-projected-camera not initialized')
                    return;
                }
                this._cameraGps = camera.components['gps-projected-camera'];
                this._updatePosition();
            }
        };
        


        // update position needs to worry about distance but nothing else?
        this.updatePositionListener = (ev) => {
            if (!this.data || !this._cameraGps) {
                return;
            }

            var dstCoords = this.el.getAttribute('position');

            // it's actually a 'distance place', but we don't call it with last param, because we want to retrieve distance even if it's < minDistance property
            // _computeDistanceMeters is now going to use the projected
            var distanceForMsg = this._cameraGps.computeDistanceMeters(dstCoords);

            this.el.setAttribute('distance', distanceForMsg);
            this.el.setAttribute('distanceMsg', formatDistance(distanceForMsg));

            this.el.dispatchEvent(new CustomEvent('gps-entity-place-update-positon', { detail: { distance: distanceForMsg } }));

            var actualDistance = this._cameraGps.computeDistanceMeters(dstCoords, true);

            if (actualDistance === Number.MAX_SAFE_INTEGER) {
                this.hideForMinDistance(this.el, true);
            } else {
                this.hideForMinDistance(this.el, false);
            }
        };

        // Retain as this event is fired when the GPS camera is set up
        window.addEventListener('gps-camera-origin-coord-set', this.coordSetListener);
        window.addEventListener('gps-camera-update-position', this.updatePositionListener);

        this._positionXDebug = 0;

        window.dispatchEvent(new CustomEvent('gps-entity-place-added', { detail: { component: this.el } }));
    },
    /**
     * Hide entity according to minDistance property
     * @returns {void}
     */
    hideForMinDistance: function(el, hideEntity) {
        if (hideEntity) {
            el.setAttribute('visible', 'false');
        } else {
            el.setAttribute('visible', 'true');
        }
    },
    /**
     * Update place position
     * @returns {void}
     */

    // set position to world coords using the lat/lon 
    _updatePosition: function() {
        var worldPos = this._cameraGps.latLonToWorld(this.data.latitude, this.data.longitude);
        var position = this.el.getAttribute('position');

        // update element's position in 3D world
        //this.el.setAttribute('position', position);
        this.el.setAttribute('position', {
            x: worldPos[0],
            y: position.y, 
            z: worldPos[1]
        }); 
    },
});

/**
 * Format distances string
 *
 * @param {String} distance
 */
function formatDistance(distance) {
    distance = distance.toFixed(0);

    if (distance >= 1000) {
        return (distance / 1000) + ' kilometers';
    }

    return distance + ' meters';
};


/***/ }),

/***/ "aframe":
/*!******************************************************************************************!*\
  !*** external {"commonjs":"aframe","commonjs2":"aframe","amd":"aframe","root":"AFRAME"} ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_aframe__;

/***/ }),

/***/ "three":
/*!**************************************************************************************!*\
  !*** external {"commonjs":"three","commonjs2":"three","amd":"three","root":"THREE"} ***!
  \**************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_three__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************************!*\
  !*** ./aframe/src/location-based/index.js ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arjs_look_controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arjs-look-controls */ "./aframe/src/location-based/arjs-look-controls.js");
/* harmony import */ var _arjs_webcam_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arjs-webcam-texture */ "./aframe/src/location-based/arjs-webcam-texture.js");
/* harmony import */ var _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ArjsDeviceOrientationControls */ "./aframe/src/location-based/ArjsDeviceOrientationControls.js");
/* harmony import */ var _gps_camera__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gps-camera */ "./aframe/src/location-based/gps-camera.js");
/* harmony import */ var _gps_entity_place__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gps-entity-place */ "./aframe/src/location-based/gps-entity-place.js");
/* harmony import */ var _gps_projected_camera__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./gps-projected-camera */ "./aframe/src/location-based/gps-projected-camera.js");
/* harmony import */ var _gps_projected_entity_place__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./gps-projected-entity-place */ "./aframe/src/location-based/gps-projected-entity-place.js");








})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9BcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scy5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9hcmpzLWxvb2stY29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvYXJqcy13ZWJjYW0tdGV4dHVyZS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9ncHMtY2FtZXJhLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL2dwcy1lbnRpdHktcGxhY2UuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvZ3BzLXByb2plY3RlZC1jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvZ3BzLXByb2plY3RlZC1lbnRpdHktcGxhY2UuanMiLCJ3ZWJwYWNrOi8vQVJqcy9leHRlcm5hbCB7XCJjb21tb25qc1wiOlwiYWZyYW1lXCIsXCJjb21tb25qczJcIjpcImFmcmFtZVwiLFwiYW1kXCI6XCJhZnJhbWVcIixcInJvb3RcIjpcIkFGUkFNRVwifSIsIndlYnBhY2s6Ly9BUmpzL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJ0aHJlZVwiLFwiY29tbW9uanMyXCI6XCJ0aHJlZVwiLFwiYW1kXCI6XCJ0aHJlZVwiLFwicm9vdFwiOlwiVEhSRUVcIn0iLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0FSanMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRStCOztBQUUvQjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsdUJBQXVCOztBQUV2Qjs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLGtCQUFrQiwwQ0FBYTs7QUFFL0Isb0JBQW9CLHdDQUFXOztBQUUvQixpQkFBaUIsNkNBQWdCOztBQUVqQyxpQkFBaUIsNkNBQWdCLCtDQUErQzs7QUFFaEY7O0FBRUEsK0NBQStDOztBQUUvQyx1Q0FBdUM7O0FBRXZDLGdDQUFnQzs7QUFFaEMsa0VBQWtFOztBQUVsRTs7QUFFQSxHQUFHOztBQUVIOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxpQ0FBaUMsZ0RBQW1CLHlDQUF5Qzs7QUFFN0YsK0JBQStCLGdEQUFtQixvQkFBb0I7O0FBRXRFLGlDQUFpQyxnREFBbUIscUJBQXFCOztBQUV6RSw2Q0FBNkMsZ0RBQW1CLGdDQUFnQzs7QUFFaEc7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsS0FBSyxPO0FBQ0wsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLGlFQUFlLDZCQUE2QixFQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNwSzdDO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVnQztBQUMyQzs7QUFFM0UscURBQXdCO0FBQ3hCOztBQUVBO0FBQ0EsY0FBYyxjQUFjO0FBQzVCLGlDQUFpQyxjQUFjO0FBQy9DLHlCQUF5QixlQUFlO0FBQ3hDLHVCQUF1QixlQUFlO0FBQ3RDLHVCQUF1QixlQUFlO0FBQ3RDLG1CQUFtQixjQUFjO0FBQ2pDLHNCQUFzQjtBQUN0QixHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0NBQXdDLGtCQUFrQjtBQUMxRCxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEseURBQTRCO0FBQ3BDLDJEQUEyRCxtRUFBNkI7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQix3QkFBd0I7QUFDdkQ7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSx3QkFBd0IsUUFBUTtBQUNoQztBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLDZCQUE2Qix3QkFBd0I7QUFDckQsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsNkJBQTZCLHdCQUF3QjtBQUNyRCxHQUFHOztBQUVIO0FBQ0EsdUJBQXVCLDhDQUFpQjtBQUN4Qyx1QkFBdUIsOENBQWlCO0FBQ3hDLHFCQUFxQiw4Q0FBaUI7QUFDdEMsd0JBQXdCLDhDQUFpQjtBQUN6Qyx1QkFBdUIsOENBQWlCO0FBQ3hDLHNCQUFzQiw4Q0FBaUI7QUFDdkMscUJBQXFCLDhDQUFpQjtBQUN0QyxvQkFBb0IsOENBQWlCO0FBQ3JDLCtCQUErQiw4Q0FBaUI7QUFDaEQsOEJBQThCLDhDQUFpQjtBQUMvQyxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQsOENBQWlCO0FBQ3hFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixRQUFROztBQUU1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5RUFBeUUsUUFBUTs7QUFFakY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkZBQTJGLFFBQVE7QUFDbkc7QUFDQSwyQkFBMkIsUUFBUTs7QUFFbkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsUUFBUTtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdEQUF3RCxRQUFROztBQUVoRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxRQUFRO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxRQUFRO0FBQzNEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0NBQWtDLCtDQUErQztBQUNqRixtQ0FBbUMsa0RBQWtEOztBQUVyRjtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2QkFBNkIsUUFBUTs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6ZStCO0FBQ0Y7O0FBRTlCLHFEQUF3Qjs7QUFFeEI7QUFDQTtBQUNBLDZCQUE2QixxREFBd0I7QUFDckQsNEJBQTRCLHdDQUFXOztBQUV2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHNEQUF5QixHQUFHO0FBQ3BELDJCQUEyQiwrQ0FBa0I7QUFDN0MsNEJBQTRCLG9EQUF1QixHQUFHLG9CQUFvQjtBQUMxRSx5QkFBeUIsdUNBQVU7QUFDbkM7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0EsOEM7QUFDQTtBQUNBLGFBQWE7QUFDYix5QkFBeUIsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO0FBQ3hELFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0REQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFaUM7QUFDRjs7QUFFL0IscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsZ0RBQWdELDBCQUEwQjtBQUMxRTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1FQUFtRSxZQUFZOztBQUUvRTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBUztBQUN4QixlQUFlLFNBQVM7QUFDeEIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsbUVBQW1FO0FBQ3hGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDRFQUE0RSxVQUFVLDBEQUEwRCxFQUFFO0FBQ2xKLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEIsZUFBZSxTQUFTO0FBQ3hCLGVBQWUsUUFBUTtBQUN2QjtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0EseUJBQXlCLGdEQUFtQjtBQUM1Qyx3QkFBd0IsZ0RBQW1COztBQUUzQywrRUFBK0UsZ0RBQW1CLDJCQUEyQixnREFBbUI7QUFDaEo7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxlQUFlLE1BQU07QUFDckIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGdEQUFtQjtBQUM3QztBQUNBLGlEQUFpRCxnREFBbUI7QUFDcEUsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQy9aZ0M7O0FBRWpDLHFEQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzRkFBc0YsVUFBVSwyQkFBMkIsRUFBRTs7QUFFN0g7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSx3RUFBd0UsVUFBVSxxQkFBcUIsRUFBRTtBQUN6RyxLQUFLO0FBQ0w7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLHdCQUF3Qjs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZ0M7O0FBRWhDLHFEQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsZ0RBQWdELDBCQUEwQjtBQUMxRTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtFQUFrRSxZQUFZOztBQUU5RTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEIsZUFBZSxTQUFTO0FBQ3hCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLG1FQUFtRTtBQUN4RjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw0RUFBNEUsVUFBVSwwREFBMEQsRUFBRTtBQUNsSixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBUztBQUN4QixlQUFlLFFBQVE7QUFDdkI7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQSxpQkFBaUIsTUFBTTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBLGlCQUFpQixNQUFNO0FBQ3ZCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxlQUFlLE1BQU07QUFDckIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNsZUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2dDOztBQUVoQyxxREFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHNGQUFzRixVQUFVLDJCQUEyQixFQUFFOztBQUU3SDs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsd0VBQXdFLFVBQVUscUJBQXFCLEVBQUU7QUFDekcsS0FBSztBQUNMO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsRTtBQUNULEtBQUs7QUFDTCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDcklBLG9EOzs7Ozs7Ozs7O0FDQUEsbUQ7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONkI7QUFDQztBQUNVO0FBQ25CO0FBQ007QUFDSTtBQUNNIiwiZmlsZSI6ImFmcmFtZS1hci1sb2NhdGlvbi1vbmx5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiYWZyYW1lXCIpLCByZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiYWZyYW1lXCIsIFwidGhyZWVcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiQVJqc1wiXSA9IGZhY3RvcnkocmVxdWlyZShcImFmcmFtZVwiKSwgcmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJBUmpzXCJdID0gZmFjdG9yeShyb290W1wiQUZSQU1FXCJdLCByb290W1wiVEhSRUVcIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9hZnJhbWVfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV90aHJlZV9fKSB7XG5yZXR1cm4gIiwiXG4vKipcbiAqIEBhdXRob3IgcmljaHQgLyBodHRwOi8vcmljaHQubWVcbiAqIEBhdXRob3IgV2VzdExhbmdsZXkgLyBodHRwOi8vZ2l0aHViLmNvbS9XZXN0TGFuZ2xleVxuICpcbiAqIFczQyBEZXZpY2UgT3JpZW50YXRpb24gY29udHJvbCAoaHR0cDovL3czYy5naXRodWIuaW8vZGV2aWNlb3JpZW50YXRpb24vc3BlYy1zb3VyY2Utb3JpZW50YXRpb24uaHRtbClcbiAqL1xuXG4vKiBOT1RFIHRoYXQgdGhpcyBpcyBhIG1vZGlmaWVkIHZlcnNpb24gb2YgVEhSRUUuRGV2aWNlT3JpZW50YXRpb25Db250cm9scyB0byBcbiAqIGFsbG93IGV4cG9uZW50aWFsIHNtb290aGluZywgZm9yIHVzZSBpbiBBUi5qcy5cbiAqXG4gKiBNb2RpZmljYXRpb25zIE5pY2sgV2hpdGVsZWdnIChuaWNrdzEgZ2l0aHViKVxuICovXG5cbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5jb25zdCBBcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scyA9IGZ1bmN0aW9uICggb2JqZWN0ICkge1xuXG4gIHZhciBzY29wZSA9IHRoaXM7XG5cbiAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gIHRoaXMub2JqZWN0LnJvdGF0aW9uLnJlb3JkZXIoICdZWFonICk7XG5cbiAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICB0aGlzLmRldmljZU9yaWVudGF0aW9uID0ge307XG4gIHRoaXMuc2NyZWVuT3JpZW50YXRpb24gPSAwO1xuXG4gIHRoaXMuYWxwaGFPZmZzZXQgPSAwOyAvLyByYWRpYW5zXG5cbiAgdGhpcy5zbW9vdGhpbmdGYWN0b3IgPSAxO1xuXG4gIHRoaXMuVFdPX1BJID0gMiAqIE1hdGguUEk7XG4gIHRoaXMuSEFMRl9QSSA9IDAuNSAqIE1hdGguUEk7XG5cbiAgdmFyIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uICggZXZlbnQgKSB7XG5cbiAgICBzY29wZS5kZXZpY2VPcmllbnRhdGlvbiA9IGV2ZW50O1xuXG4gIH07XG5cbiAgdmFyIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHNjb3BlLnNjcmVlbk9yaWVudGF0aW9uID0gd2luZG93Lm9yaWVudGF0aW9uIHx8IDA7XG5cbiAgfTtcblxuICAvLyBUaGUgYW5nbGVzIGFscGhhLCBiZXRhIGFuZCBnYW1tYSBmb3JtIGEgc2V0IG9mIGludHJpbnNpYyBUYWl0LUJyeWFuIGFuZ2xlcyBvZiB0eXBlIFotWCctWScnXG5cbiAgdmFyIHNldE9iamVjdFF1YXRlcm5pb24gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgemVlID0gbmV3IFRIUkVFLlZlY3RvcjMoIDAsIDAsIDEgKTtcblxuICAgIHZhciBldWxlciA9IG5ldyBUSFJFRS5FdWxlcigpO1xuXG4gICAgdmFyIHEwID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKTtcblxuICAgIHZhciBxMSA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCAtIE1hdGguc3FydCggMC41ICksIDAsIDAsIE1hdGguc3FydCggMC41ICkgKTsgLy8gLSBQSS8yIGFyb3VuZCB0aGUgeC1heGlzXG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCBxdWF0ZXJuaW9uLCBhbHBoYSwgYmV0YSwgZ2FtbWEsIG9yaWVudCApIHtcblxuICAgICAgZXVsZXIuc2V0KCBiZXRhLCBhbHBoYSwgLSBnYW1tYSwgJ1lYWicgKTsgLy8gJ1pYWScgZm9yIHRoZSBkZXZpY2UsIGJ1dCAnWVhaJyBmb3IgdXNcblxuICAgICAgcXVhdGVybmlvbi5zZXRGcm9tRXVsZXIoIGV1bGVyICk7IC8vIG9yaWVudCB0aGUgZGV2aWNlXG5cbiAgICAgIHF1YXRlcm5pb24ubXVsdGlwbHkoIHExICk7IC8vIGNhbWVyYSBsb29rcyBvdXQgdGhlIGJhY2sgb2YgdGhlIGRldmljZSwgbm90IHRoZSB0b3BcblxuICAgICAgcXVhdGVybmlvbi5tdWx0aXBseSggcTAuc2V0RnJvbUF4aXNBbmdsZSggemVlLCAtIG9yaWVudCApICk7IC8vIGFkanVzdCBmb3Igc2NyZWVuIG9yaWVudGF0aW9uXG5cbiAgICB9O1xuXG4gIH0oKTtcblxuICB0aGlzLmNvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XG4gXG4gICAgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50KCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ29yaWVudGF0aW9uY2hhbmdlJywgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50LCBmYWxzZSApO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnZGV2aWNlb3JpZW50YXRpb24nLCBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnQsIGZhbHNlICk7XG5cbiAgICBzY29wZS5lbmFibGVkID0gdHJ1ZTtcblxuICB9O1xuXG4gIHRoaXMuZGlzY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAnb3JpZW50YXRpb25jaGFuZ2UnLCBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQsIGZhbHNlICk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdkZXZpY2VvcmllbnRhdGlvbicsIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudCwgZmFsc2UgKTtcblxuICAgIHNjb3BlLmVuYWJsZWQgPSBmYWxzZTtcblxuICB9O1xuXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKCBzY29wZS5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuICAgIHZhciBkZXZpY2UgPSBzY29wZS5kZXZpY2VPcmllbnRhdGlvbjtcblxuICAgIGlmICggZGV2aWNlICkge1xuXG4gICAgICB2YXIgYWxwaGEgPSBkZXZpY2UuYWxwaGEgPyBUSFJFRS5NYXRoLmRlZ1RvUmFkKCBkZXZpY2UuYWxwaGEgKSArIHNjb3BlLmFscGhhT2Zmc2V0IDogMDsgLy8gWlxuXG4gICAgICB2YXIgYmV0YSA9IGRldmljZS5iZXRhID8gVEhSRUUuTWF0aC5kZWdUb1JhZCggZGV2aWNlLmJldGEgKSA6IDA7IC8vIFgnXG5cbiAgICAgIHZhciBnYW1tYSA9IGRldmljZS5nYW1tYSA/IFRIUkVFLk1hdGguZGVnVG9SYWQoIGRldmljZS5nYW1tYSApIDogMDsgLy8gWScnXG5cbiAgICAgIHZhciBvcmllbnQgPSBzY29wZS5zY3JlZW5PcmllbnRhdGlvbiA/IFRIUkVFLk1hdGguZGVnVG9SYWQoIHNjb3BlLnNjcmVlbk9yaWVudGF0aW9uICkgOiAwOyAvLyBPXG5cbiAgICAgIC8vIE5XIEFkZGVkIHNtb290aGluZyBjb2RlXG4gICAgICB2YXIgayA9IHRoaXMuc21vb3RoaW5nRmFjdG9yO1xuXG4gICAgICBpZih0aGlzLmxhc3RPcmllbnRhdGlvbikge1xuICAgICAgICBhbHBoYSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoYWxwaGEsIHRoaXMubGFzdE9yaWVudGF0aW9uLmFscGhhLCBrKTtcbiAgICAgICAgYmV0YSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoYmV0YSArIE1hdGguUEksIHRoaXMubGFzdE9yaWVudGF0aW9uLmJldGEsIGspO1xuICAgICAgICBnYW1tYSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoZ2FtbWEgKyB0aGlzLkhBTEZfUEksIHRoaXMubGFzdE9yaWVudGF0aW9uLmdhbW1hLCBrLCBNYXRoLlBJKTtcbiAgICBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJldGEgKz0gTWF0aC5QSTtcbiAgICAgICAgZ2FtbWEgKz0gdGhpcy5IQUxGX1BJO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxhc3RPcmllbnRhdGlvbiA9IHtcbiAgICAgICAgYWxwaGE6IGFscGhhLFxuICAgICAgICBiZXRhOiBiZXRhLFxuICAgICAgICBnYW1tYTogZ2FtbWFcbiAgICAgIH07XG4gICAgICBzZXRPYmplY3RRdWF0ZXJuaW9uKCBzY29wZS5vYmplY3QucXVhdGVybmlvbiwgYWxwaGEsIGJldGEgLSBNYXRoLlBJLCBnYW1tYSAtIHRoaXMuSEFMRl9QSSwgb3JpZW50ICk7XG5cbiAgICB9XG4gIH07XG5cbiAgIFxuICAgLy8gTlcgQWRkZWRcbiAgdGhpcy5fb3JkZXJBbmdsZSA9IGZ1bmN0aW9uKGEsIGIsIHJhbmdlID0gdGhpcy5UV09fUEkpIHtcbiAgICBpZiAoKGIgPiBhICYmIE1hdGguYWJzKGIgLSBhKSA8IHJhbmdlIC8gMikgfHwgKGEgPiBiICYmIE1hdGguYWJzKGIgLSBhKSA+IHJhbmdlIC8gMikpIHtcbiAgICAgIHJldHVybiB7IGxlZnQ6IGEsIHJpZ2h0OiBiIH1cbiAgICB9IGVsc2UgeyBcbiAgICAgIHJldHVybiB7IGxlZnQ6IGIsIHJpZ2h0OiBhIH1cbiAgICB9XG4gIH07XG5cbiAgIC8vIE5XIEFkZGVkXG4gIHRoaXMuX2dldFNtb290aGVkQW5nbGUgPSBmdW5jdGlvbihhLCBiLCBrLCByYW5nZSA9IHRoaXMuVFdPX1BJKSB7XG4gICAgY29uc3QgYW5nbGVzID0gdGhpcy5fb3JkZXJBbmdsZShhLCBiLCByYW5nZSk7XG4gICAgY29uc3QgYW5nbGVzaGlmdCA9IGFuZ2xlcy5sZWZ0O1xuICAgIGNvbnN0IG9yaWdBbmdsZXNSaWdodCA9IGFuZ2xlcy5yaWdodDtcbiAgICBhbmdsZXMubGVmdCA9IDA7XG4gICAgYW5nbGVzLnJpZ2h0IC09IGFuZ2xlc2hpZnQ7XG4gICAgaWYoYW5nbGVzLnJpZ2h0IDwgMCkgYW5nbGVzLnJpZ2h0ICs9IHJhbmdlO1xuICAgIGxldCBuZXdhbmdsZSA9IG9yaWdBbmdsZXNSaWdodCA9PSBiID8gKDEgLSBrKSphbmdsZXMucmlnaHQgKyBrICogYW5nbGVzLmxlZnQgOiBrICogYW5nbGVzLnJpZ2h0ICsgKDEgLSBrKSAqIGFuZ2xlcy5sZWZ0O1xuICAgIG5ld2FuZ2xlICs9IGFuZ2xlc2hpZnQ7XG4gICAgaWYobmV3YW5nbGUgPj0gcmFuZ2UpIG5ld2FuZ2xlIC09IHJhbmdlO1xuICAgIHJldHVybiBuZXdhbmdsZTtcbiAgfTtcblxuICB0aGlzLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2NvcGUuZGlzY29ubmVjdCgpO1xuICB9O1xuXG4gIHRoaXMuY29ubmVjdCgpO1xuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scztcbiIsIi8vIFRvIGF2b2lkIHJlY2FsY3VsYXRpb24gYXQgZXZlcnkgbW91c2UgbW92ZW1lbnQgdGlja1xudmFyIFBJXzIgPSBNYXRoLlBJIC8gMjtcblxuXG4vKipcbiAqIGxvb2stY29udHJvbHMuIFVwZGF0ZSBlbnRpdHkgcG9zZSwgZmFjdG9yaW5nIG1vdXNlLCB0b3VjaCwgYW5kIFdlYlZSIEFQSSBkYXRhLlxuICovXG5cbi8qIE5PVEUgdGhhdCB0aGlzIGlzIGEgbW9kaWZpZWQgdmVyc2lvbiBvZiBBLUZyYW1lJ3MgbG9vay1jb250cm9scyB0byBcbiAqIGFsbG93IGV4cG9uZW50aWFsIHNtb290aGluZywgZm9yIHVzZSBpbiBBUi5qcy5cbiAqXG4gKiBNb2RpZmljYXRpb25zIE5pY2sgV2hpdGVsZWdnIChuaWNrdzEgZ2l0aHViKVxuICovXG5cbmltcG9ydCAqIGFzIEFGUkFNRSBmcm9tICdhZnJhbWUnXG5pbXBvcnQgQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHMgZnJvbSAnLi9BcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scydcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdhcmpzLWxvb2stY29udHJvbHMnLCB7XG4gIGRlcGVuZGVuY2llczogWydwb3NpdGlvbicsICdyb3RhdGlvbiddLFxuXG4gIHNjaGVtYToge1xuICAgIGVuYWJsZWQ6IHtkZWZhdWx0OiB0cnVlfSxcbiAgICBtYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZDoge2RlZmF1bHQ6IHRydWV9LFxuICAgIHBvaW50ZXJMb2NrRW5hYmxlZDoge2RlZmF1bHQ6IGZhbHNlfSxcbiAgICByZXZlcnNlTW91c2VEcmFnOiB7ZGVmYXVsdDogZmFsc2V9LFxuICAgIHJldmVyc2VUb3VjaERyYWc6IHtkZWZhdWx0OiBmYWxzZX0sXG4gICAgdG91Y2hFbmFibGVkOiB7ZGVmYXVsdDogdHJ1ZX0sXG4gICAgc21vb3RoaW5nRmFjdG9yOiB7IHR5cGU6ICdudW1iZXInLCBkZWZhdWx0OiAxIH1cbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5kZWx0YVlhdyA9IDA7XG4gICAgdGhpcy5wcmV2aW91c0hNRFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLmhtZFF1YXRlcm5pb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xuICAgIHRoaXMubWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyID0gbmV3IFRIUkVFLkV1bGVyKCk7XG4gICAgdGhpcy5tYWdpY1dpbmRvd0RlbHRhRXVsZXIgPSBuZXcgVEhSRUUuRXVsZXIoKTtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLm1hZ2ljV2luZG93T2JqZWN0ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gICAgdGhpcy5yb3RhdGlvbiA9IHt9O1xuICAgIHRoaXMuZGVsdGFSb3RhdGlvbiA9IHt9O1xuICAgIHRoaXMuc2F2ZWRQb3NlID0gbnVsbDtcbiAgICB0aGlzLnBvaW50ZXJMb2NrZWQgPSBmYWxzZTtcbiAgICB0aGlzLnNldHVwTW91c2VDb250cm9scygpO1xuICAgIHRoaXMuYmluZE1ldGhvZHMoKTtcbiAgICB0aGlzLnByZXZpb3VzTW91c2VFdmVudCA9IHt9O1xuXG4gICAgdGhpcy5zZXR1cE1hZ2ljV2luZG93Q29udHJvbHMoKTtcblxuICAgIC8vIFRvIHNhdmUgLyByZXN0b3JlIGNhbWVyYSBwb3NlXG4gICAgdGhpcy5zYXZlZFBvc2UgPSB7XG4gICAgICBwb3NpdGlvbjogbmV3IFRIUkVFLlZlY3RvcjMoKSxcbiAgICAgIHJvdGF0aW9uOiBuZXcgVEhSRUUuRXVsZXIoKVxuICAgIH07XG5cbiAgICAvLyBDYWxsIGVudGVyIFZSIGhhbmRsZXIgaWYgdGhlIHNjZW5lIGhhcyBlbnRlcmVkIFZSIGJlZm9yZSB0aGUgZXZlbnQgbGlzdGVuZXJzIGF0dGFjaGVkLlxuICAgIGlmICh0aGlzLmVsLnNjZW5lRWwuaXMoJ3ZyLW1vZGUnKSkgeyB0aGlzLm9uRW50ZXJWUigpOyB9XG4gIH0sXG5cbiAgc2V0dXBNYWdpY1dpbmRvd0NvbnRyb2xzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1hZ2ljV2luZG93Q29udHJvbHM7XG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG5cbiAgICAvLyBPbmx5IG9uIG1vYmlsZSBkZXZpY2VzIGFuZCBvbmx5IGVuYWJsZWQgaWYgRGV2aWNlT3JpZW50YXRpb24gcGVybWlzc2lvbiBoYXMgYmVlbiBncmFudGVkLlxuICAgIGlmIChBRlJBTUUudXRpbHMuZGV2aWNlLmlzTW9iaWxlKCkpIHtcbiAgICAgIG1hZ2ljV2luZG93Q29udHJvbHMgPSB0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMgPSBuZXcgQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHModGhpcy5tYWdpY1dpbmRvd09iamVjdCk7XG4gICAgICBpZiAodHlwZW9mIERldmljZU9yaWVudGF0aW9uRXZlbnQgIT09ICd1bmRlZmluZWQnICYmIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24pIHtcbiAgICAgICAgbWFnaWNXaW5kb3dDb250cm9scy5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmVsLnNjZW5lRWwuY29tcG9uZW50c1snZGV2aWNlLW9yaWVudGF0aW9uLXBlcm1pc3Npb24tdWknXS5wZXJtaXNzaW9uR3JhbnRlZCkge1xuICAgICAgICAgIG1hZ2ljV2luZG93Q29udHJvbHMuZW5hYmxlZCA9IGRhdGEubWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9ucGVybWlzc2lvbmdyYW50ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtYWdpY1dpbmRvd0NvbnRyb2xzLmVuYWJsZWQgPSBkYXRhLm1hZ2ljV2luZG93VHJhY2tpbmdFbmFibGVkO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKG9sZERhdGEpIHtcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcblxuICAgIC8vIERpc2FibGUgZ3JhYiBjdXJzb3IgY2xhc3NlcyBpZiBubyBsb25nZXIgZW5hYmxlZC5cbiAgICBpZiAoZGF0YS5lbmFibGVkICE9PSBvbGREYXRhLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMudXBkYXRlR3JhYkN1cnNvcihkYXRhLmVuYWJsZWQpO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IG1hZ2ljIHdpbmRvdyBldWxlcnMgaWYgdHJhY2tpbmcgaXMgZGlzYWJsZWQuXG4gICAgaWYgKG9sZERhdGEgJiYgIWRhdGEubWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWQgJiYgb2xkRGF0YS5tYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZCkge1xuICAgICAgdGhpcy5tYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIuc2V0KDAsIDAsIDApO1xuICAgICAgdGhpcy5tYWdpY1dpbmRvd0RlbHRhRXVsZXIuc2V0KDAsIDAsIDApO1xuICAgIH1cblxuICAgIC8vIFBhc3Mgb24gbWFnaWMgd2luZG93IHRyYWNraW5nIHNldHRpbmcgdG8gbWFnaWNXaW5kb3dDb250cm9scy5cbiAgICBpZiAodGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzKSB7XG4gICAgICB0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMuZW5hYmxlZCA9IGRhdGEubWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWQ7XG4gICAgICB0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMuc21vb3RoaW5nRmFjdG9yID0gZGF0YS5zbW9vdGhpbmdGYWN0b3I7XG4gICAgfVxuXG4gICAgaWYgKG9sZERhdGEgJiYgIWRhdGEucG9pbnRlckxvY2tFbmFibGVkICE9PSBvbGREYXRhLnBvaW50ZXJMb2NrRW5hYmxlZCkge1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycygpO1xuICAgICAgaWYgKHRoaXMucG9pbnRlckxvY2tlZCkgeyB0aGlzLmV4aXRQb2ludGVyTG9jaygpOyB9XG4gICAgfVxuICB9LFxuXG4gIHRpY2s6IGZ1bmN0aW9uICh0KSB7XG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgaWYgKCFkYXRhLmVuYWJsZWQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy51cGRhdGVPcmllbnRhdGlvbigpO1xuICB9LFxuXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKCk7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgaWYgKHRoaXMucG9pbnRlckxvY2tlZCkgeyB0aGlzLmV4aXRQb2ludGVyTG9jaygpOyB9XG4gIH0sXG5cbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgIGlmICh0aGlzLnBvaW50ZXJMb2NrZWQpIHsgdGhpcy5leGl0UG9pbnRlckxvY2soKTsgfVxuICB9LFxuXG4gIGJpbmRNZXRob2RzOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5vbk1vdXNlRG93biA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Nb3VzZURvd24sIHRoaXMpO1xuICAgIHRoaXMub25Nb3VzZU1vdmUgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uTW91c2VNb3ZlLCB0aGlzKTtcbiAgICB0aGlzLm9uTW91c2VVcCA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Nb3VzZVVwLCB0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hTdGFydCA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Ub3VjaFN0YXJ0LCB0aGlzKTtcbiAgICB0aGlzLm9uVG91Y2hNb3ZlID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vblRvdWNoTW92ZSwgdGhpcyk7XG4gICAgdGhpcy5vblRvdWNoRW5kID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vblRvdWNoRW5kLCB0aGlzKTtcbiAgICB0aGlzLm9uRW50ZXJWUiA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25FbnRlclZSLCB0aGlzKTtcbiAgICB0aGlzLm9uRXhpdFZSID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vbkV4aXRWUiwgdGhpcyk7XG4gICAgdGhpcy5vblBvaW50ZXJMb2NrQ2hhbmdlID0gQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5vblBvaW50ZXJMb2NrQ2hhbmdlLCB0aGlzKTtcbiAgICB0aGlzLm9uUG9pbnRlckxvY2tFcnJvciA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Qb2ludGVyTG9ja0Vycm9yLCB0aGlzKTtcbiAgfSxcblxuIC8qKlxuICAqIFNldCB1cCBzdGF0ZXMgYW5kIE9iamVjdDNEcyBuZWVkZWQgdG8gc3RvcmUgcm90YXRpb24gZGF0YS5cbiAgKi9cbiAgc2V0dXBNb3VzZUNvbnRyb2xzOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLnBpdGNoT2JqZWN0ID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gICAgdGhpcy55YXdPYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgICB0aGlzLnlhd09iamVjdC5wb3NpdGlvbi55ID0gMTA7XG4gICAgdGhpcy55YXdPYmplY3QuYWRkKHRoaXMucGl0Y2hPYmplY3QpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgbW91c2UgYW5kIHRvdWNoIGV2ZW50IGxpc3RlbmVycyB0byBjYW52YXMuXG4gICAqL1xuICBhZGRFdmVudExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xuICAgIHZhciBjYW52YXNFbCA9IHNjZW5lRWwuY2FudmFzO1xuXG4gICAgLy8gV2FpdCBmb3IgY2FudmFzIHRvIGxvYWQuXG4gICAgaWYgKCFjYW52YXNFbCkge1xuICAgICAgc2NlbmVFbC5hZGRFdmVudExpc3RlbmVyKCdyZW5kZXItdGFyZ2V0LWxvYWRlZCcsIEFGUkFNRS51dGlscy5iaW5kKHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMsIHRoaXMpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBNb3VzZSBldmVudHMuXG4gICAgY2FudmFzRWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93biwgZmFsc2UpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlLCBmYWxzZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCwgZmFsc2UpO1xuXG4gICAgLy8gVG91Y2ggZXZlbnRzLlxuICAgIGNhbnZhc0VsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCk7XG5cbiAgICAvLyBzY2VuZUVsIGV2ZW50cy5cbiAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2VudGVyLXZyJywgdGhpcy5vbkVudGVyVlIpO1xuICAgIHNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcignZXhpdC12cicsIHRoaXMub25FeGl0VlIpO1xuXG4gICAgLy8gUG9pbnRlciBMb2NrIGV2ZW50cy5cbiAgICBpZiAodGhpcy5kYXRhLnBvaW50ZXJMb2NrRW5hYmxlZCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxvY2tjaGFuZ2UnLCB0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UsIGZhbHNlKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21venBvaW50ZXJsb2NrY2hhbmdlJywgdGhpcy5vblBvaW50ZXJMb2NrQ2hhbmdlLCBmYWxzZSk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybG9ja2Vycm9yJywgdGhpcy5vblBvaW50ZXJMb2NrRXJyb3IsIGZhbHNlKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSBtb3VzZSBhbmQgdG91Y2ggZXZlbnQgbGlzdGVuZXJzIGZyb20gY2FudmFzLlxuICAgKi9cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2NlbmVFbCA9IHRoaXMuZWwuc2NlbmVFbDtcbiAgICB2YXIgY2FudmFzRWwgPSBzY2VuZUVsICYmIHNjZW5lRWwuY2FudmFzO1xuXG4gICAgaWYgKCFjYW52YXNFbCkgeyByZXR1cm47IH1cblxuICAgIC8vIE1vdXNlIGV2ZW50cy5cbiAgICBjYW52YXNFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCk7XG5cbiAgICAvLyBUb3VjaCBldmVudHMuXG4gICAgY2FudmFzRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kKTtcblxuICAgIC8vIHNjZW5lRWwgZXZlbnRzLlxuICAgIHNjZW5lRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZW50ZXItdnInLCB0aGlzLm9uRW50ZXJWUik7XG4gICAgc2NlbmVFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdleGl0LXZyJywgdGhpcy5vbkV4aXRWUik7XG5cbiAgICAvLyBQb2ludGVyIExvY2sgZXZlbnRzLlxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJsb2NrY2hhbmdlJywgdGhpcy5vblBvaW50ZXJMb2NrQ2hhbmdlLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW96cG9pbnRlcmxvY2tjaGFuZ2UnLCB0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybG9ja2Vycm9yJywgdGhpcy5vblBvaW50ZXJMb2NrRXJyb3IsIGZhbHNlKTtcbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIG9yaWVudGF0aW9uIGZvciBtb2JpbGUsIG1vdXNlIGRyYWcsIGFuZCBoZWFkc2V0LlxuICAgKiBNb3VzZS1kcmFnIG9ubHkgZW5hYmxlZCBpZiBITUQgaXMgbm90IGFjdGl2ZS5cbiAgICovXG4gIHVwZGF0ZU9yaWVudGF0aW9uOiAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb3NlTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb2JqZWN0M0QgPSB0aGlzLmVsLm9iamVjdDNEO1xuICAgICAgdmFyIHBpdGNoT2JqZWN0ID0gdGhpcy5waXRjaE9iamVjdDtcbiAgICAgIHZhciB5YXdPYmplY3QgPSB0aGlzLnlhd09iamVjdDtcbiAgICAgIHZhciBwb3NlO1xuICAgICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XG5cbiAgICAgIC8vIEluIFZSIG1vZGUsIFRIUkVFIGlzIGluIGNoYXJnZSBvZiB1cGRhdGluZyB0aGUgY2FtZXJhIHBvc2UuXG4gICAgICBpZiAoc2NlbmVFbC5pcygndnItbW9kZScpICYmIHNjZW5lRWwuY2hlY2tIZWFkc2V0Q29ubmVjdGVkKCkpIHtcbiAgICAgICAgLy8gV2l0aCBXZWJYUiBUSFJFRSBhcHBsaWVzIGhlYWRzZXQgcG9zZSB0byB0aGUgb2JqZWN0M0QgbWF0cml4V29ybGQgaW50ZXJuYWxseS5cbiAgICAgICAgLy8gUmVmbGVjdCB2YWx1ZXMgYmFjayBvbiBwb3NpdGlvbiwgcm90YXRpb24sIHNjYWxlIGZvciBnZXRBdHRyaWJ1dGUgdG8gcmV0dXJuIHRoZSBleHBlY3RlZCB2YWx1ZXMuXG4gICAgICAgIGlmIChzY2VuZUVsLmhhc1dlYlhSKSB7XG4gICAgICAgICAgcG9zZSA9IHNjZW5lRWwucmVuZGVyZXIueHIuZ2V0Q2FtZXJhUG9zZSgpO1xuICAgICAgICAgIGlmIChwb3NlKSB7XG4gICAgICAgICAgICBwb3NlTWF0cml4LmVsZW1lbnRzID0gcG9zZS50cmFuc2Zvcm0ubWF0cml4O1xuICAgICAgICAgICAgcG9zZU1hdHJpeC5kZWNvbXBvc2Uob2JqZWN0M0QucG9zaXRpb24sIG9iamVjdDNELnJvdGF0aW9uLCBvYmplY3QzRC5zY2FsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy51cGRhdGVNYWdpY1dpbmRvd09yaWVudGF0aW9uKCk7XG5cbiAgICAgIC8vIE9uIG1vYmlsZSwgZG8gY2FtZXJhIHJvdGF0aW9uIHdpdGggdG91Y2ggZXZlbnRzIGFuZCBzZW5zb3JzLlxuICAgICAgb2JqZWN0M0Qucm90YXRpb24ueCA9IHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyLnggKyBwaXRjaE9iamVjdC5yb3RhdGlvbi54O1xuICAgICAgb2JqZWN0M0Qucm90YXRpb24ueSA9IHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyLnkgKyB5YXdPYmplY3Qucm90YXRpb24ueTtcbiAgICAgIG9iamVjdDNELnJvdGF0aW9uLnogPSB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlci56O1xuICAgIH07XG4gIH0pKCksXG5cbiAgdXBkYXRlTWFnaWNXaW5kb3dPcmllbnRhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIgPSB0aGlzLm1hZ2ljV2luZG93QWJzb2x1dGVFdWxlcjtcbiAgICB2YXIgbWFnaWNXaW5kb3dEZWx0YUV1bGVyID0gdGhpcy5tYWdpY1dpbmRvd0RlbHRhRXVsZXI7XG4gICAgLy8gQ2FsY3VsYXRlIG1hZ2ljIHdpbmRvdyBITUQgcXVhdGVybmlvbi5cbiAgICBpZiAodGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzICYmIHRoaXMubWFnaWNXaW5kb3dDb250cm9scy5lbmFibGVkKSB7XG4gICAgICB0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMudXBkYXRlKCk7XG4gICAgICBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIuc2V0RnJvbVF1YXRlcm5pb24odGhpcy5tYWdpY1dpbmRvd09iamVjdC5xdWF0ZXJuaW9uLCAnWVhaJyk7XG4gICAgICBpZiAoIXRoaXMucHJldmlvdXNNYWdpY1dpbmRvd1lhdyAmJiBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIueSAhPT0gMCkge1xuICAgICAgICB0aGlzLnByZXZpb3VzTWFnaWNXaW5kb3dZYXcgPSBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIueTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnByZXZpb3VzTWFnaWNXaW5kb3dZYXcpIHtcbiAgICAgICAgbWFnaWNXaW5kb3dEZWx0YUV1bGVyLnggPSBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIueDtcbiAgICAgICAgbWFnaWNXaW5kb3dEZWx0YUV1bGVyLnkgKz0gbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnkgLSB0aGlzLnByZXZpb3VzTWFnaWNXaW5kb3dZYXc7XG4gICAgICAgIG1hZ2ljV2luZG93RGVsdGFFdWxlci56ID0gbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLno7XG4gICAgICAgIHRoaXMucHJldmlvdXNNYWdpY1dpbmRvd1lhdyA9IG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci55O1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVHJhbnNsYXRlIG1vdXNlIGRyYWcgaW50byByb3RhdGlvbi5cbiAgICpcbiAgICogRHJhZ2dpbmcgdXAgYW5kIGRvd24gcm90YXRlcyB0aGUgY2FtZXJhIGFyb3VuZCB0aGUgWC1heGlzICh5YXcpLlxuICAgKiBEcmFnZ2luZyBsZWZ0IGFuZCByaWdodCByb3RhdGVzIHRoZSBjYW1lcmEgYXJvdW5kIHRoZSBZLWF4aXMgKHBpdGNoKS5cbiAgICovXG4gIG9uTW91c2VNb3ZlOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIGRpcmVjdGlvbjtcbiAgICB2YXIgbW92ZW1lbnRYO1xuICAgIHZhciBtb3ZlbWVudFk7XG4gICAgdmFyIHBpdGNoT2JqZWN0ID0gdGhpcy5waXRjaE9iamVjdDtcbiAgICB2YXIgcHJldmlvdXNNb3VzZUV2ZW50ID0gdGhpcy5wcmV2aW91c01vdXNlRXZlbnQ7XG4gICAgdmFyIHlhd09iamVjdCA9IHRoaXMueWF3T2JqZWN0O1xuXG4gICAgLy8gTm90IGRyYWdnaW5nIG9yIG5vdCBlbmFibGVkLlxuICAgIGlmICghdGhpcy5kYXRhLmVuYWJsZWQgfHwgKCF0aGlzLm1vdXNlRG93biAmJiAhdGhpcy5wb2ludGVyTG9ja2VkKSkgeyByZXR1cm47IH1cblxuICAgIC8vIENhbGN1bGF0ZSBkZWx0YS5cbiAgICBpZiAodGhpcy5wb2ludGVyTG9ja2VkKSB7XG4gICAgICBtb3ZlbWVudFggPSBldnQubW92ZW1lbnRYIHx8IGV2dC5tb3pNb3ZlbWVudFggfHwgMDtcbiAgICAgIG1vdmVtZW50WSA9IGV2dC5tb3ZlbWVudFkgfHwgZXZ0Lm1vek1vdmVtZW50WSB8fCAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb3ZlbWVudFggPSBldnQuc2NyZWVuWCAtIHByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5YO1xuICAgICAgbW92ZW1lbnRZID0gZXZ0LnNjcmVlblkgLSBwcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWTtcbiAgICB9XG4gICAgdGhpcy5wcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWCA9IGV2dC5zY3JlZW5YO1xuICAgIHRoaXMucHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblkgPSBldnQuc2NyZWVuWTtcblxuICAgIC8vIENhbGN1bGF0ZSByb3RhdGlvbi5cbiAgICBkaXJlY3Rpb24gPSB0aGlzLmRhdGEucmV2ZXJzZU1vdXNlRHJhZyA/IDEgOiAtMTtcbiAgICB5YXdPYmplY3Qucm90YXRpb24ueSArPSBtb3ZlbWVudFggKiAwLjAwMiAqIGRpcmVjdGlvbjtcbiAgICBwaXRjaE9iamVjdC5yb3RhdGlvbi54ICs9IG1vdmVtZW50WSAqIDAuMDAyICogZGlyZWN0aW9uO1xuICAgIHBpdGNoT2JqZWN0LnJvdGF0aW9uLnggPSBNYXRoLm1heCgtUElfMiwgTWF0aC5taW4oUElfMiwgcGl0Y2hPYmplY3Qucm90YXRpb24ueCkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBtb3VzZSBkb3duIHRvIGRldGVjdCBtb3VzZSBkcmFnLlxuICAgKi9cbiAgb25Nb3VzZURvd246IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgc2NlbmVFbCA9IHRoaXMuZWwuc2NlbmVFbDtcbiAgICBpZiAoIXRoaXMuZGF0YS5lbmFibGVkIHx8IChzY2VuZUVsLmlzKCd2ci1tb2RlJykgJiYgc2NlbmVFbC5jaGVja0hlYWRzZXRDb25uZWN0ZWQoKSkpIHsgcmV0dXJuOyB9XG4gICAgLy8gSGFuZGxlIG9ubHkgcHJpbWFyeSBidXR0b24uXG4gICAgaWYgKGV2dC5idXR0b24gIT09IDApIHsgcmV0dXJuOyB9XG5cbiAgICB2YXIgY2FudmFzRWwgPSBzY2VuZUVsICYmIHNjZW5lRWwuY2FudmFzO1xuXG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuICAgIHRoaXMucHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblggPSBldnQuc2NyZWVuWDtcbiAgICB0aGlzLnByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5ZID0gZXZ0LnNjcmVlblk7XG4gICAgdGhpcy5zaG93R3JhYmJpbmdDdXJzb3IoKTtcblxuICAgIGlmICh0aGlzLmRhdGEucG9pbnRlckxvY2tFbmFibGVkICYmICF0aGlzLnBvaW50ZXJMb2NrZWQpIHtcbiAgICAgIGlmIChjYW52YXNFbC5yZXF1ZXN0UG9pbnRlckxvY2spIHtcbiAgICAgICAgY2FudmFzRWwucmVxdWVzdFBvaW50ZXJMb2NrKCk7XG4gICAgICB9IGVsc2UgaWYgKGNhbnZhc0VsLm1velJlcXVlc3RQb2ludGVyTG9jaykge1xuICAgICAgICBjYW52YXNFbC5tb3pSZXF1ZXN0UG9pbnRlckxvY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNob3dzIGdyYWJiaW5nIGN1cnNvciBvbiBzY2VuZVxuICAgKi9cbiAgc2hvd0dyYWJiaW5nQ3Vyc29yOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbC5zY2VuZUVsLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAnZ3JhYmJpbmcnO1xuICB9LFxuXG4gIC8qKlxuICAgKiBIaWRlcyBncmFiYmluZyBjdXJzb3Igb24gc2NlbmVcbiAgICovXG4gIGhpZGVHcmFiYmluZ0N1cnNvcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZWwuc2NlbmVFbC5jYW52YXMuc3R5bGUuY3Vyc29yID0gJyc7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIG1vdXNlIHVwIHRvIGRldGVjdCByZWxlYXNlIG9mIG1vdXNlIGRyYWcuXG4gICAqL1xuICBvbk1vdXNlVXA6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZUdyYWJiaW5nQ3Vyc29yKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRvdWNoIGRvd24gdG8gZGV0ZWN0IHRvdWNoIGRyYWcuXG4gICAqL1xuICBvblRvdWNoU3RhcnQ6IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoZXZ0LnRvdWNoZXMubGVuZ3RoICE9PSAxIHx8XG4gICAgICAgICF0aGlzLmRhdGEudG91Y2hFbmFibGVkIHx8XG4gICAgICAgIHRoaXMuZWwuc2NlbmVFbC5pcygndnItbW9kZScpKSB7IHJldHVybjsgfVxuICAgIHRoaXMudG91Y2hTdGFydCA9IHtcbiAgICAgIHg6IGV2dC50b3VjaGVzWzBdLnBhZ2VYLFxuICAgICAgeTogZXZ0LnRvdWNoZXNbMF0ucGFnZVlcbiAgICB9O1xuICAgIHRoaXMudG91Y2hTdGFydGVkID0gdHJ1ZTtcbiAgfSxcblxuICAvKipcbiAgICogVHJhbnNsYXRlIHRvdWNoIG1vdmUgdG8gWS1heGlzIHJvdGF0aW9uLlxuICAgKi9cbiAgb25Ub3VjaE1vdmU6IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgZGlyZWN0aW9uO1xuICAgIHZhciBjYW52YXMgPSB0aGlzLmVsLnNjZW5lRWwuY2FudmFzO1xuICAgIHZhciBkZWx0YVk7XG4gICAgdmFyIHlhd09iamVjdCA9IHRoaXMueWF3T2JqZWN0O1xuXG4gICAgaWYgKCF0aGlzLnRvdWNoU3RhcnRlZCB8fCAhdGhpcy5kYXRhLnRvdWNoRW5hYmxlZCkgeyByZXR1cm47IH1cblxuICAgIGRlbHRhWSA9IDIgKiBNYXRoLlBJICogKGV2dC50b3VjaGVzWzBdLnBhZ2VYIC0gdGhpcy50b3VjaFN0YXJ0LngpIC8gY2FudmFzLmNsaWVudFdpZHRoO1xuXG4gICAgZGlyZWN0aW9uID0gdGhpcy5kYXRhLnJldmVyc2VUb3VjaERyYWcgPyAxIDogLTE7XG4gICAgLy8gTGltaXQgdG91Y2ggb3JpZW50YWlvbiB0byB0byB5YXcgKHkgYXhpcykuXG4gICAgeWF3T2JqZWN0LnJvdGF0aW9uLnkgLT0gZGVsdGFZICogMC41ICogZGlyZWN0aW9uO1xuICAgIHRoaXMudG91Y2hTdGFydCA9IHtcbiAgICAgIHg6IGV2dC50b3VjaGVzWzBdLnBhZ2VYLFxuICAgICAgeTogZXZ0LnRvdWNoZXNbMF0ucGFnZVlcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0b3VjaCBlbmQgdG8gZGV0ZWN0IHJlbGVhc2Ugb2YgdG91Y2ggZHJhZy5cbiAgICovXG4gIG9uVG91Y2hFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnRvdWNoU3RhcnRlZCA9IGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTYXZlIHBvc2UuXG4gICAqL1xuICBvbkVudGVyVlI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2NlbmVFbCA9IHRoaXMuZWwuc2NlbmVFbDtcbiAgICBpZiAoIXNjZW5lRWwuY2hlY2tIZWFkc2V0Q29ubmVjdGVkKCkpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5zYXZlQ2FtZXJhUG9zZSgpO1xuICAgIHRoaXMuZWwub2JqZWN0M0QucG9zaXRpb24uc2V0KDAsIDAsIDApO1xuICAgIHRoaXMuZWwub2JqZWN0M0Qucm90YXRpb24uc2V0KDAsIDAsIDApO1xuICAgIGlmIChzY2VuZUVsLmhhc1dlYlhSKSB7XG4gICAgICB0aGlzLmVsLm9iamVjdDNELm1hdHJpeEF1dG9VcGRhdGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZWwub2JqZWN0M0QudXBkYXRlTWF0cml4KCk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXN0b3JlIHRoZSBwb3NlLlxuICAgKi9cbiAgb25FeGl0VlI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZWwuc2NlbmVFbC5jaGVja0hlYWRzZXRDb25uZWN0ZWQoKSkgeyByZXR1cm47IH1cbiAgICB0aGlzLnJlc3RvcmVDYW1lcmFQb3NlKCk7XG4gICAgdGhpcy5wcmV2aW91c0hNRFBvc2l0aW9uLnNldCgwLCAwLCAwKTtcbiAgICB0aGlzLmVsLm9iamVjdDNELm1hdHJpeEF1dG9VcGRhdGUgPSB0cnVlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgUG9pbnRlciBMb2NrIHN0YXRlLlxuICAgKi9cbiAgb25Qb2ludGVyTG9ja0NoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucG9pbnRlckxvY2tlZCA9ICEhKGRvY3VtZW50LnBvaW50ZXJMb2NrRWxlbWVudCB8fCBkb2N1bWVudC5tb3pQb2ludGVyTG9ja0VsZW1lbnQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWNvdmVyIGZyb20gUG9pbnRlciBMb2NrIGVycm9yLlxuICAgKi9cbiAgb25Qb2ludGVyTG9ja0Vycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wb2ludGVyTG9ja2VkID0gZmFsc2U7XG4gIH0sXG5cbiAgLy8gRXhpdHMgcG9pbnRlci1sb2NrZWQgbW9kZS5cbiAgZXhpdFBvaW50ZXJMb2NrOiBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrKCk7XG4gICAgdGhpcy5wb2ludGVyTG9ja2VkID0gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgZmVhdHVyZSBvZiBzaG93aW5nL2hpZGluZyB0aGUgZ3JhYiBjdXJzb3IuXG4gICAqL1xuICB1cGRhdGVHcmFiQ3Vyc29yOiBmdW5jdGlvbiAoZW5hYmxlZCkge1xuICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xuXG4gICAgZnVuY3Rpb24gZW5hYmxlR3JhYkN1cnNvciAoKSB7IHNjZW5lRWwuY2FudmFzLmNsYXNzTGlzdC5hZGQoJ2EtZ3JhYi1jdXJzb3InKTsgfVxuICAgIGZ1bmN0aW9uIGRpc2FibGVHcmFiQ3Vyc29yICgpIHsgc2NlbmVFbC5jYW52YXMuY2xhc3NMaXN0LnJlbW92ZSgnYS1ncmFiLWN1cnNvcicpOyB9XG5cbiAgICBpZiAoIXNjZW5lRWwuY2FudmFzKSB7XG4gICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoJ3JlbmRlci10YXJnZXQtbG9hZGVkJywgZW5hYmxlR3JhYkN1cnNvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoJ3JlbmRlci10YXJnZXQtbG9hZGVkJywgZGlzYWJsZUdyYWJDdXJzb3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChlbmFibGVkKSB7XG4gICAgICBlbmFibGVHcmFiQ3Vyc29yKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRpc2FibGVHcmFiQ3Vyc29yKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNhdmUgY2FtZXJhIHBvc2UgYmVmb3JlIGVudGVyaW5nIFZSIHRvIHJlc3RvcmUgbGF0ZXIgaWYgZXhpdGluZy5cbiAgICovXG4gIHNhdmVDYW1lcmFQb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbDtcblxuICAgIHRoaXMuc2F2ZWRQb3NlLnBvc2l0aW9uLmNvcHkoZWwub2JqZWN0M0QucG9zaXRpb24pO1xuICAgIHRoaXMuc2F2ZWRQb3NlLnJvdGF0aW9uLmNvcHkoZWwub2JqZWN0M0Qucm90YXRpb24pO1xuICAgIHRoaXMuaGFzU2F2ZWRQb3NlID0gdHJ1ZTtcbiAgfSxcblxuICAvKipcbiAgICogUmVzZXQgY2FtZXJhIHBvc2UgdG8gYmVmb3JlIGVudGVyaW5nIFZSLlxuICAgKi9cbiAgcmVzdG9yZUNhbWVyYVBvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsO1xuICAgIHZhciBzYXZlZFBvc2UgPSB0aGlzLnNhdmVkUG9zZTtcblxuICAgIGlmICghdGhpcy5oYXNTYXZlZFBvc2UpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBSZXNldCBjYW1lcmEgb3JpZW50YXRpb24uXG4gICAgZWwub2JqZWN0M0QucG9zaXRpb24uY29weShzYXZlZFBvc2UucG9zaXRpb24pO1xuICAgIGVsLm9iamVjdDNELnJvdGF0aW9uLmNvcHkoc2F2ZWRQb3NlLnJvdGF0aW9uKTtcbiAgICB0aGlzLmhhc1NhdmVkUG9zZSA9IGZhbHNlO1xuICB9XG59KTtcbiIsImltcG9ydCAqIGFzIEFGUkFNRSBmcm9tICdhZnJhbWUnXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSdcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdhcmpzLXdlYmNhbS10ZXh0dXJlJywge1xuXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2NlbmUgPSB0aGlzLmVsLnNjZW5lRWw7XG4gICAgICAgIHRoaXMudGV4Q2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSgtMC41LCAwLjUsIDAuNSwgLTAuNSwgMCwgMTApO1xuICAgICAgICB0aGlzLnRleFNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgICAgdGhpcy5zY2VuZS5yZW5kZXJlci5hdXRvQ2xlYXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy52aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKTtcbiAgICAgICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoXCJhdXRvcGxheVwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnZpZGVvKTtcbiAgICAgICAgdGhpcy5nZW9tID0gbmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkoKTsgLy8wLjUsIDAuNSk7XG4gICAgICAgIHRoaXMudGV4dHVyZSA9IG5ldyBUSFJFRS5WaWRlb1RleHR1cmUodGhpcy52aWRlbyk7XG4gICAgICAgIHRoaXMubWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgbWFwOiB0aGlzLnRleHR1cmUgfSApO1xuICAgICAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2godGhpcy5nZW9tLCB0aGlzLm1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy50ZXhTY2VuZS5hZGQobWVzaCk7XG4gICAgfSxcblxuICAgIHBsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihuYXZpZ2F0b3IubWVkaWFEZXZpY2VzICYmIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XG4gICAgICAgICAgICBjb25zdCBjb25zdHJhaW50cyA9IHsgdmlkZW86IHtcbiAgICAgICAgICAgICAgICBmYWNpbmdNb2RlOiAnZW52aXJvbm1lbnQnIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShjb25zdHJhaW50cykudGhlbiggc3RyZWFtPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtOyAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnZpZGVvLnBsYXkoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZSA9PiB7IGFsZXJ0KGBXZWJjYW0gZXJyb3I6ICR7ZX1gKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgnc29ycnkgLSBtZWRpYSBkZXZpY2VzIEFQSSBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5zY2VuZS5yZW5kZXJlci5yZW5kZXIodGhpcy50ZXhTY2VuZSwgdGhpcy50ZXhDYW1lcmEpO1xuICAgICAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLmNsZWFyRGVwdGgoKTtcbiAgICB9LFxuXG4gICAgcGF1c2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnZpZGVvLnNyY09iamVjdC5nZXRUcmFja3MoKS5mb3JFYWNoICggdHJhY2sgPT4ge1xuICAgICAgICAgICAgdHJhY2suc3RvcCgpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5tYXRlcmlhbC5kaXNwb3NlKCk7XG4gICAgICAgIHRoaXMudGV4dHVyZS5kaXNwb3NlKCk7XG4gICAgICAgIHRoaXMuZ2VvbS5kaXNwb3NlKCk7XG4gICAgfVxufSk7XG4iLCIvKlxuICogVVBEQVRFUyAyOC8wOC8yMDpcbiAqXG4gKiAtIGFkZCBncHNNaW5EaXN0YW5jZSBhbmQgZ3BzVGltZUludGVydmFsIHByb3BlcnRpZXMgdG8gY29udHJvbCBob3dcbiAqIGZyZXF1ZW50bHkgR1BTIHVwZGF0ZXMgYXJlIHByb2Nlc3NlZC4gQWltIGlzIHRvIHByZXZlbnQgJ3N0dXR0ZXJpbmcnXG4gKiBlZmZlY3RzIHdoZW4gY2xvc2UgdG8gQVIgY29udGVudCBkdWUgdG8gY29udGludW91cyBzbWFsbCBjaGFuZ2VzIGluXG4gKiBsb2NhdGlvbi5cbiAqL1xuXG5pbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSAnYWZyYW1lJztcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcblxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KCdncHMtY2FtZXJhJywge1xuICAgIF93YXRjaFBvc2l0aW9uSWQ6IG51bGwsXG4gICAgb3JpZ2luQ29vcmRzOiBudWxsLFxuICAgIGN1cnJlbnRDb29yZHM6IG51bGwsXG4gICAgbG9va0NvbnRyb2xzOiBudWxsLFxuICAgIGhlYWRpbmc6IG51bGwsXG4gICAgc2NoZW1hOiB7XG4gICAgICAgIHNpbXVsYXRlTGF0aXR1ZGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgc2ltdWxhdGVMb25naXR1ZGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgc2ltdWxhdGVBbHRpdHVkZToge1xuICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICB9LFxuICAgICAgICBwb3NpdGlvbk1pbkFjY3VyYWN5OiB7XG4gICAgICAgICAgICB0eXBlOiAnaW50JyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEwMCxcbiAgICAgICAgfSxcbiAgICAgICAgYWxlcnQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBtaW5EaXN0YW5jZToge1xuICAgICAgICAgICAgdHlwZTogJ2ludCcsXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICB9LFxuICAgICAgICBtYXhEaXN0YW5jZToge1xuICAgICAgICAgICAgdHlwZTogJ2ludCcsXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICB9LFxuICAgICAgICBncHNNaW5EaXN0YW5jZToge1xuICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICBkZWZhdWx0OiA1LFxuICAgICAgICB9LFxuICAgICAgICBncHNUaW1lSW50ZXJ2YWw6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPT0gMCAmJiB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT09IDApIHtcbiAgICAgICAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jdXJyZW50Q29vcmRzIHx8IHt9KTtcbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb24ubG9uZ2l0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlO1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5sYXRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlO1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29vcmRzID0gbG9jYWxQb3NpdGlvbjtcblxuICAgICAgICAgICAgLy8gcmUtdHJpZ2dlciBpbml0aWFsaXphdGlvbiBmb3IgbmV3IG9yaWdpblxuICAgICAgICAgICAgdGhpcy5vcmlnaW5Db29yZHMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuZWwuY29tcG9uZW50c1snYXJqcy1sb29rLWNvbnRyb2xzJ10gJiYgIXRoaXMuZWwuY29tcG9uZW50c1snbG9vay1jb250cm9scyddKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIGxhdGl0dWRlOiAwLFxuICAgICAgICAgICAgbG9uZ2l0dWRlOiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2FkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcbiAgICAgICAgdGhpcy5sb2FkZXIuY2xhc3NMaXN0LmFkZCgnYXJqcy1sb2FkZXInKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmxvYWRlcik7XG5cbiAgICAgICAgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWQgPSB0aGlzLl9vbkdwc0VudGl0eVBsYWNlQWRkZWQuYmluZCh0aGlzKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2dwcy1lbnRpdHktcGxhY2UtYWRkZWQnLCB0aGlzLm9uR3BzRW50aXR5UGxhY2VBZGRlZCk7XG5cbiAgICAgICAgdGhpcy5sb29rQ29udHJvbHMgPSB0aGlzLmVsLmNvbXBvbmVudHNbJ2FyanMtbG9vay1jb250cm9scyddIHx8IHRoaXMuZWwuY29tcG9uZW50c1snbG9vay1jb250cm9scyddO1xuXG4gICAgICAgIC8vIGxpc3RlbiB0byBkZXZpY2VvcmllbnRhdGlvbiBldmVudFxuICAgICAgICB2YXIgZXZlbnROYW1lID0gdGhpcy5fZ2V0RGV2aWNlT3JpZW50YXRpb25FdmVudE5hbWUoKTtcbiAgICAgICAgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiA9IHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24uYmluZCh0aGlzKTtcblxuICAgICAgICAvLyBpZiBTYWZhcmlcbiAgICAgICAgaWYgKCEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVmVyc2lvblxcL1tcXGQuXSsuKlNhZmFyaS8pKSB7XG4gICAgICAgICAgICAvLyBpT1MgMTMrXG4gICAgICAgICAgICBpZiAodHlwZW9mIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlcXVlc3RpbmcgZGV2aWNlIG9yaWVudGF0aW9uIHBlcm1pc3Npb25zLi4uJylcbiAgICAgICAgICAgICAgICAgICAgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uICgpIHsgaGFuZGxlcigpIH0sIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIGFsZXJ0KCdBZnRlciBjYW1lcmEgcGVybWlzc2lvbiBwcm9tcHQsIHBsZWFzZSB0YXAgdGhlIHNjcmVlbiB0byBhY3RpdmF0ZSBnZW9sb2NhdGlvbi4nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1BsZWFzZSBlbmFibGUgZGV2aWNlIG9yaWVudGF0aW9uIGluIFNldHRpbmdzID4gU2FmYXJpID4gTW90aW9uICYgT3JpZW50YXRpb24gQWNjZXNzLicpXG4gICAgICAgICAgICAgICAgfSwgNzUwKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gdGhpcy5faW5pdFdhdGNoR1BTKGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgICAgICAgICAgdmFyIGxvY2FsUG9zaXRpb24gPSB7XG4gICAgICAgICAgICAgICAgbGF0aXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICAgICAgICBsb25naXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICAgICAgYWx0aXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5hbHRpdHVkZSxcbiAgICAgICAgICAgICAgICBhY2N1cmFjeTogcG9zaXRpb24uY29vcmRzLmFjY3VyYWN5LFxuICAgICAgICAgICAgICAgIGFsdGl0dWRlQWNjdXJhY3k6IHBvc2l0aW9uLmNvb3Jkcy5hbHRpdHVkZUFjY3VyYWN5LFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlICE9PSAwICYmIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGxvY2FsUG9zaXRpb24ubGF0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZTtcbiAgICAgICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmxvbmdpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENvb3JkcyA9IGxvY2FsUG9zaXRpb247XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RNb3ZlZCA9IHRoaXMuX2hhdmVyc2luZURpc3QoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHNcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYoZGlzdE1vdmVkID49IHRoaXMuZGF0YS5ncHNNaW5EaXN0YW5jZSB8fCAhdGhpcy5vcmlnaW5Db29yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxhdGl0dWRlXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICB0aWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhlYWRpbmcgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVSb3RhdGlvbigpO1xuICAgIH0sXG5cbiAgICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dhdGNoUG9zaXRpb25JZCkge1xuICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmNsZWFyV2F0Y2godGhpcy5fd2F0Y2hQb3NpdGlvbklkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSBudWxsO1xuXG4gICAgICAgIHZhciBldmVudE5hbWUgPSB0aGlzLl9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZSgpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24sIGZhbHNlKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2dwcy1lbnRpdHktcGxhY2UtYWRkZWQnLCB0aGlzLm9uR3BzRW50aXR5UGxhY2VBZGRlZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBkZXZpY2Ugb3JpZW50YXRpb24gZXZlbnQgbmFtZSwgZGVwZW5kcyBvbiBicm93c2VyIGltcGxlbWVudGF0aW9uLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGV2ZW50IG5hbWVcbiAgICAgKi9cbiAgICBfZ2V0RGV2aWNlT3JpZW50YXRpb25FdmVudE5hbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCdvbmRldmljZW9yaWVudGF0aW9uYWJzb2x1dGUnIGluIHdpbmRvdykge1xuICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSA9ICdkZXZpY2VvcmllbnRhdGlvbmFic29sdXRlJ1xuICAgICAgICB9IGVsc2UgaWYgKCdvbmRldmljZW9yaWVudGF0aW9uJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSAnZGV2aWNlb3JpZW50YXRpb24nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gJydcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbXBhc3Mgbm90IHN1cHBvcnRlZCcpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXZlbnROYW1lXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBjdXJyZW50IHVzZXIgcG9zaXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvblN1Y2Nlc3NcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkVycm9yXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICovXG4gICAgX2luaXRXYXRjaEdQUzogZnVuY3Rpb24gKG9uU3VjY2Vzcywgb25FcnJvcikge1xuICAgICAgICBpZiAoIW9uRXJyb3IpIHtcbiAgICAgICAgICAgIG9uRXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdFUlJPUignICsgZXJyLmNvZGUgKyAnKTogJyArIGVyci5tZXNzYWdlKVxuXG4gICAgICAgICAgICAgICAgaWYgKGVyci5jb2RlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVzZXIgZGVuaWVkIEdlb0xvY2F0aW9uLCBsZXQgdGhlaXIga25vdyB0aGF0XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdQbGVhc2UgYWN0aXZhdGUgR2VvbG9jYXRpb24gYW5kIHJlZnJlc2ggdGhlIHBhZ2UuIElmIGl0IGlzIGFscmVhZHkgYWN0aXZlLCBwbGVhc2UgY2hlY2sgcGVybWlzc2lvbnMgZm9yIHRoaXMgd2Vic2l0ZS4nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQ2Fubm90IHJldHJpZXZlIEdQUyBwb3NpdGlvbi4gU2lnbmFsIGlzIGFic2VudC4nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2dlb2xvY2F0aW9uJyBpbiBuYXZpZ2F0b3IgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBvbkVycm9yKHsgY29kZTogMCwgbWVzc2FnZTogJ0dlb2xvY2F0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgYnkgeW91ciBicm93c2VyJyB9KTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9HZW9sb2NhdGlvbi93YXRjaFBvc2l0aW9uXG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24ud2F0Y2hQb3NpdGlvbihvblN1Y2Nlc3MsIG9uRXJyb3IsIHtcbiAgICAgICAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSxcbiAgICAgICAgICAgIG1heGltdW1BZ2U6IHRoaXMuZGF0YS5ncHNUaW1lSW50ZXJ2YWwsXG4gICAgICAgICAgICB0aW1lb3V0OiAyNzAwMCxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB1c2VyIHBvc2l0aW9uLlxuICAgICAqXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgX3VwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGRvbid0IHVwZGF0ZSBpZiBhY2N1cmFjeSBpcyBub3QgZ29vZCBlbm91Z2hcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENvb3Jkcy5hY2N1cmFjeSA+IHRoaXMuZGF0YS5wb3NpdGlvbk1pbkFjY3VyYWN5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmFsZXJ0ICYmICFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxlcnQtcG9wdXAnKSkge1xuICAgICAgICAgICAgICAgIHZhciBwb3B1cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIHBvcHVwLmlubmVySFRNTCA9ICdHUFMgc2lnbmFsIGlzIHZlcnkgcG9vci4gVHJ5IG1vdmUgb3V0ZG9vciBvciB0byBhbiBhcmVhIHdpdGggYSBiZXR0ZXIgc2lnbmFsLidcbiAgICAgICAgICAgICAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2FsZXJ0LXBvcHVwJyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwb3B1cCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbGVydC1wb3B1cCcpO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q29vcmRzLmFjY3VyYWN5IDw9IHRoaXMuZGF0YS5wb3NpdGlvbk1pbkFjY3VyYWN5ICYmIGFsZXJ0UG9wdXApIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYWxlcnRQb3B1cCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICAgICAgICAvLyBmaXJzdCBjYW1lcmEgaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICAgIHRoaXMub3JpZ2luQ29vcmRzID0gdGhpcy5jdXJyZW50Q29vcmRzO1xuICAgICAgICAgICAgdGhpcy5fc2V0UG9zaXRpb24oKTtcblxuICAgICAgICAgICAgdmFyIGxvYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcmpzLWxvYWRlcicpO1xuICAgICAgICAgICAgaWYgKGxvYWRlcikge1xuICAgICAgICAgICAgICAgIGxvYWRlci5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0JykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc2V0UG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgX3NldFBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKCdwb3NpdGlvbicpO1xuXG4gICAgICAgIC8vIGNvbXB1dGUgcG9zaXRpb24ueFxuICAgICAgICB2YXIgZHN0Q29vcmRzID0ge1xuICAgICAgICAgICAgbG9uZ2l0dWRlOiB0aGlzLmN1cnJlbnRDb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgbGF0aXR1ZGU6IHRoaXMub3JpZ2luQ29vcmRzLmxhdGl0dWRlLFxuICAgICAgICB9O1xuXG4gICAgICAgIHBvc2l0aW9uLnggPSB0aGlzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyh0aGlzLm9yaWdpbkNvb3JkcywgZHN0Q29vcmRzKTtcbiAgICAgICAgcG9zaXRpb24ueCAqPSB0aGlzLmN1cnJlbnRDb29yZHMubG9uZ2l0dWRlID4gdGhpcy5vcmlnaW5Db29yZHMubG9uZ2l0dWRlID8gMSA6IC0xO1xuXG4gICAgICAgIC8vIGNvbXB1dGUgcG9zaXRpb24uelxuICAgICAgICB2YXIgZHN0Q29vcmRzID0ge1xuICAgICAgICAgICAgbG9uZ2l0dWRlOiB0aGlzLm9yaWdpbkNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICBsYXRpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxhdGl0dWRlLFxuICAgICAgICB9XG5cbiAgICAgICAgcG9zaXRpb24ueiA9IHRoaXMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKHRoaXMub3JpZ2luQ29vcmRzLCBkc3RDb29yZHMpO1xuICAgICAgICBwb3NpdGlvbi56ICo9IHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSA+IHRoaXMub3JpZ2luQ29vcmRzLmxhdGl0dWRlID8gLTEgOiAxO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBwb3NpdGlvblxuICAgICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCBwb3NpdGlvbik7XG5cbiAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvbicsIHsgZGV0YWlsOiB7IHBvc2l0aW9uOiB0aGlzLmN1cnJlbnRDb29yZHMsIG9yaWdpbjogdGhpcy5vcmlnaW5Db29yZHMgfSB9KSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGRpc3RhbmNlIGluIG1ldGVycyBiZXR3ZWVuIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gaW5wdXRzLlxuICAgICAqXG4gICAgICogIENhbGN1bGF0ZSBkaXN0YW5jZSwgYmVhcmluZyBhbmQgbW9yZSBiZXR3ZWVuIExhdGl0dWRlL0xvbmdpdHVkZSBwb2ludHNcbiAgICAgKiAgRGV0YWlsczogaHR0cHM6Ly93d3cubW92YWJsZS10eXBlLmNvLnVrL3NjcmlwdHMvbGF0bG9uZy5odG1sXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1Bvc2l0aW9ufSBzcmNcbiAgICAgKiBAcGFyYW0ge1Bvc2l0aW9ufSBkZXN0XG4gICAgICogQHBhcmFtIHtCb29sZWFufSBpc1BsYWNlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBkaXN0YW5jZSB8IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgICovXG4gICAgY29tcHV0ZURpc3RhbmNlTWV0ZXJzOiBmdW5jdGlvbiAoc3JjLCBkZXN0LCBpc1BsYWNlKSB7XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IHRoaXMuX2hhdmVyc2luZURpc3QgKHNyYywgZGVzdCk7XG5cbiAgICAgICAgLy8gaWYgZnVuY3Rpb24gaGFzIGJlZW4gY2FsbGVkIGZvciBhIHBsYWNlLCBhbmQgaWYgaXQncyB0b28gbmVhciBhbmQgYSBtaW4gZGlzdGFuY2UgaGFzIGJlZW4gc2V0LFxuICAgICAgICAvLyByZXR1cm4gbWF4IGRpc3RhbmNlIHBvc3NpYmxlIC0gdG8gYmUgaGFuZGxlZCBieSB0aGUgY2FsbGVyXG4gICAgICAgIGlmIChpc1BsYWNlICYmIHRoaXMuZGF0YS5taW5EaXN0YW5jZSAmJiB0aGlzLmRhdGEubWluRGlzdGFuY2UgPiAwICYmIGRpc3RhbmNlIDwgdGhpcy5kYXRhLm1pbkRpc3RhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBmdW5jdGlvbiBoYXMgYmVlbiBjYWxsZWQgZm9yIGEgcGxhY2UsIGFuZCBpZiBpdCdzIHRvbyBmYXIgYW5kIGEgbWF4IGRpc3RhbmNlIGhhcyBiZWVuIHNldCxcbiAgICAgICAgLy8gcmV0dXJuIG1heCBkaXN0YW5jZSBwb3NzaWJsZSAtIHRvIGJlIGhhbmRsZWQgYnkgdGhlIGNhbGxlclxuICAgICAgICBpZiAoaXNQbGFjZSAmJiB0aGlzLmRhdGEubWF4RGlzdGFuY2UgJiYgdGhpcy5kYXRhLm1heERpc3RhbmNlID4gMCAmJiBkaXN0YW5jZSA+IHRoaXMuZGF0YS5tYXhEaXN0YW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRpc3RhbmNlO1xuICAgIH0sXG5cbiAgICBfaGF2ZXJzaW5lRGlzdDogZnVuY3Rpb24gKHNyYywgZGVzdCkge1xuICAgICAgICB2YXIgZGxvbmdpdHVkZSA9IFRIUkVFLk1hdGguZGVnVG9SYWQoZGVzdC5sb25naXR1ZGUgLSBzcmMubG9uZ2l0dWRlKTtcbiAgICAgICAgdmFyIGRsYXRpdHVkZSA9IFRIUkVFLk1hdGguZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSAtIHNyYy5sYXRpdHVkZSk7XG5cbiAgICAgICAgdmFyIGEgPSAoTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgKiBNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSkgKyBNYXRoLmNvcyhUSFJFRS5NYXRoLmRlZ1RvUmFkKHNyYy5sYXRpdHVkZSkpICogTWF0aC5jb3MoVEhSRUUuTWF0aC5kZWdUb1JhZChkZXN0LmxhdGl0dWRlKSkgKiAoTWF0aC5zaW4oZGxvbmdpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxvbmdpdHVkZSAvIDIpKTtcbiAgICAgICAgdmFyIGFuZ2xlID0gMiAqIE1hdGguYXRhbjIoTWF0aC5zcXJ0KGEpLCBNYXRoLnNxcnQoMSAtIGEpKTtcbiAgICAgICAgcmV0dXJuIGFuZ2xlICogNjM3MTAwMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSBjb21wYXNzIGhlYWRpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmV0YVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBnYW1tYVxuICAgICAqXG4gICAgICogQHJldHVybnMge251bWJlcn0gY29tcGFzcyBoZWFkaW5nXG4gICAgICovXG4gICAgX2NvbXB1dGVDb21wYXNzSGVhZGluZzogZnVuY3Rpb24gKGFscGhhLCBiZXRhLCBnYW1tYSkge1xuXG4gICAgICAgIC8vIENvbnZlcnQgZGVncmVlcyB0byByYWRpYW5zXG4gICAgICAgIHZhciBhbHBoYVJhZCA9IGFscGhhICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICB2YXIgYmV0YVJhZCA9IGJldGEgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgICAgIHZhciBnYW1tYVJhZCA9IGdhbW1hICogKE1hdGguUEkgLyAxODApO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBlcXVhdGlvbiBjb21wb25lbnRzXG4gICAgICAgIHZhciBjQSA9IE1hdGguY29zKGFscGhhUmFkKTtcbiAgICAgICAgdmFyIHNBID0gTWF0aC5zaW4oYWxwaGFSYWQpO1xuICAgICAgICB2YXIgc0IgPSBNYXRoLnNpbihiZXRhUmFkKTtcbiAgICAgICAgdmFyIGNHID0gTWF0aC5jb3MoZ2FtbWFSYWQpO1xuICAgICAgICB2YXIgc0cgPSBNYXRoLnNpbihnYW1tYVJhZCk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIEEsIEIsIEMgcm90YXRpb24gY29tcG9uZW50c1xuICAgICAgICB2YXIgckEgPSAtIGNBICogc0cgLSBzQSAqIHNCICogY0c7XG4gICAgICAgIHZhciByQiA9IC0gc0EgKiBzRyArIGNBICogc0IgKiBjRztcblxuICAgICAgICAvLyBDYWxjdWxhdGUgY29tcGFzcyBoZWFkaW5nXG4gICAgICAgIHZhciBjb21wYXNzSGVhZGluZyA9IE1hdGguYXRhbihyQSAvIHJCKTtcblxuICAgICAgICAvLyBDb252ZXJ0IGZyb20gaGFsZiB1bml0IGNpcmNsZSB0byB3aG9sZSB1bml0IGNpcmNsZVxuICAgICAgICBpZiAockIgPCAwKSB7XG4gICAgICAgICAgICBjb21wYXNzSGVhZGluZyArPSBNYXRoLlBJO1xuICAgICAgICB9IGVsc2UgaWYgKHJBIDwgMCkge1xuICAgICAgICAgICAgY29tcGFzc0hlYWRpbmcgKz0gMiAqIE1hdGguUEk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb252ZXJ0IHJhZGlhbnMgdG8gZGVncmVlc1xuICAgICAgICBjb21wYXNzSGVhZGluZyAqPSAxODAgLyBNYXRoLlBJO1xuXG4gICAgICAgIHJldHVybiBjb21wYXNzSGVhZGluZztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlciBmb3IgZGV2aWNlIG9yaWVudGF0aW9uIGV2ZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBfb25EZXZpY2VPcmllbnRhdGlvbjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC53ZWJraXRDb21wYXNzSGVhZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQud2Via2l0Q29tcGFzc0FjY3VyYWN5IDwgNTApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRpbmcgPSBldmVudC53ZWJraXRDb21wYXNzSGVhZGluZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCd3ZWJraXRDb21wYXNzQWNjdXJhY3kgaXMgZXZlbnQud2Via2l0Q29tcGFzc0FjY3VyYWN5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuYWxwaGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5hYnNvbHV0ZSA9PT0gdHJ1ZSB8fCBldmVudC5hYnNvbHV0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nID0gdGhpcy5fY29tcHV0ZUNvbXBhc3NIZWFkaW5nKGV2ZW50LmFscGhhLCBldmVudC5iZXRhLCBldmVudC5nYW1tYSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignZXZlbnQuYWJzb2x1dGUgPT09IGZhbHNlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2V2ZW50LmFscGhhID09PSBudWxsJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHVzZXIgcm90YXRpb24gZGF0YS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIF91cGRhdGVSb3RhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaGVhZGluZyA9IDM2MCAtIHRoaXMuaGVhZGluZztcbiAgICAgICAgdmFyIGNhbWVyYVJvdGF0aW9uID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ3JvdGF0aW9uJykueTtcbiAgICAgICAgdmFyIHlhd1JvdGF0aW9uID0gVEhSRUUuTWF0aC5yYWRUb0RlZyh0aGlzLmxvb2tDb250cm9scy55YXdPYmplY3Qucm90YXRpb24ueSk7XG4gICAgICAgIHZhciBvZmZzZXQgPSAoaGVhZGluZyAtIChjYW1lcmFSb3RhdGlvbiAtIHlhd1JvdGF0aW9uKSkgJSAzNjA7XG4gICAgICAgIHRoaXMubG9va0NvbnRyb2xzLnlhd09iamVjdC5yb3RhdGlvbi55ID0gVEhSRUUuTWF0aC5kZWdUb1JhZChvZmZzZXQpO1xuICAgIH0sXG5cbiAgICBfb25HcHNFbnRpdHlQbGFjZUFkZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gaWYgcGxhY2VzIGFyZSBhZGRlZCBhZnRlciBjYW1lcmEgaW5pdGlhbGl6YXRpb24gaXMgZmluaXNoZWRcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2dwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldCcpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5sb2FkZXIgJiYgdGhpcy5sb2FkZXIucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLmxvYWRlcilcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gJ2FmcmFtZSc7XG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnZ3BzLWVudGl0eS1wbGFjZScsIHtcbiAgICBfY2FtZXJhR3BzOiBudWxsLFxuICAgIHNjaGVtYToge1xuICAgICAgICBsb25naXR1ZGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgbGF0aXR1ZGU6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2xlYW5pbmcgbGlzdGVuZXJzIHdoZW4gdGhlIGVudGl0eSBpcyByZW1vdmVkIGZyb20gdGhlIERPTVxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0JywgdGhpcy5jb29yZFNldExpc3RlbmVyKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2dwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uJywgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyKTtcbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNvb3JkU2V0TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2NhbWVyYUdwcykge1xuICAgICAgICAgICAgICAgIHZhciBjYW1lcmEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZ3BzLWNhbWVyYV0nKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNhbWVyYS5jb21wb25lbnRzWydncHMtY2FtZXJhJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZ3BzLWNhbWVyYSBub3QgaW5pdGlhbGl6ZWQnKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbWVyYUdwcyA9IGNhbWVyYS5jb21wb25lbnRzWydncHMtY2FtZXJhJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lciA9IChldikgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRhdGEgfHwgIXRoaXMuX2NhbWVyYUdwcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRzdENvb3JkcyA9IHtcbiAgICAgICAgICAgICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5sb25naXR1ZGUsXG4gICAgICAgICAgICAgICAgbGF0aXR1ZGU6IHRoaXMuZGF0YS5sYXRpdHVkZSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGl0J3MgYWN0dWFsbHkgYSAnZGlzdGFuY2UgcGxhY2UnLCBidXQgd2UgZG9uJ3QgY2FsbCBpdCB3aXRoIGxhc3QgcGFyYW0sIGJlY2F1c2Ugd2Ugd2FudCB0byByZXRyaWV2ZSBkaXN0YW5jZSBldmVuIGlmIGl0J3MgPCBtaW5EaXN0YW5jZSBwcm9wZXJ0eVxuICAgICAgICAgICAgdmFyIGRpc3RhbmNlRm9yTXNnID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhldi5kZXRhaWwucG9zaXRpb24sIGRzdENvb3Jkcyk7XG5cbiAgICAgICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdkaXN0YW5jZScsIGRpc3RhbmNlRm9yTXNnKTtcbiAgICAgICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdkaXN0YW5jZU1zZycsIGZvcm1hdERpc3RhbmNlKGRpc3RhbmNlRm9yTXNnKSk7XG4gICAgICAgICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdncHMtZW50aXR5LXBsYWNlLXVwZGF0ZS1wb3NpdG9uJywgeyBkZXRhaWw6IHsgZGlzdGFuY2U6IGRpc3RhbmNlRm9yTXNnIH0gfSkpO1xuXG4gICAgICAgICAgICB2YXIgYWN0dWFsRGlzdGFuY2UgPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKGV2LmRldGFpbC5wb3NpdGlvbiwgZHN0Q29vcmRzLCB0cnVlKTtcblxuICAgICAgICAgICAgaWYgKGFjdHVhbERpc3RhbmNlID09PSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUZvck1pbkRpc3RhbmNlKHRoaXMuZWwsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVGb3JNaW5EaXN0YW5jZSh0aGlzLmVsLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2dwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldCcsIHRoaXMuY29vcmRTZXRMaXN0ZW5lcik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvbicsIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lcik7XG5cbiAgICAgICAgdGhpcy5fcG9zaXRpb25YRGVidWcgPSAwO1xuXG4gICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZ3BzLWVudGl0eS1wbGFjZS1hZGRlZCcsIHsgZGV0YWlsOiB7IGNvbXBvbmVudDogdGhpcy5lbCB9IH0pKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEhpZGUgZW50aXR5IGFjY29yZGluZyB0byBtaW5EaXN0YW5jZSBwcm9wZXJ0eVxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIGhpZGVGb3JNaW5EaXN0YW5jZTogZnVuY3Rpb24oZWwsIGhpZGVFbnRpdHkpIHtcbiAgICAgICAgaWYgKGhpZGVFbnRpdHkpIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgndmlzaWJsZScsICdmYWxzZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCd2aXNpYmxlJywgJ3RydWUnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHBsYWNlIHBvc2l0aW9uXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgX3VwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0geyB4OiAwLCB5OiB0aGlzLmVsLmdldEF0dHJpYnV0ZSgncG9zaXRpb24nKS55IHx8IDAsIHo6IDAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBwb3NpdGlvbi54XG4gICAgICAgIHZhciBkc3RDb29yZHMgPSB7XG4gICAgICAgICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5sb25naXR1ZGUsXG4gICAgICAgICAgICBsYXRpdHVkZTogdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgfTtcblxuICAgICAgICBwb3NpdGlvbi54ID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyh0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLCBkc3RDb29yZHMpO1xuXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uWERlYnVnID0gcG9zaXRpb24ueDtcblxuICAgICAgICBwb3NpdGlvbi54ICo9IHRoaXMuZGF0YS5sb25naXR1ZGUgPiB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmxvbmdpdHVkZSA/IDEgOiAtMTtcblxuICAgICAgICAvLyB1cGRhdGUgcG9zaXRpb24uelxuICAgICAgICB2YXIgZHN0Q29vcmRzID0ge1xuICAgICAgICAgICAgbG9uZ2l0dWRlOiB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmxvbmdpdHVkZSxcbiAgICAgICAgICAgIGxhdGl0dWRlOiB0aGlzLmRhdGEubGF0aXR1ZGUsXG4gICAgICAgIH07XG5cbiAgICAgICAgcG9zaXRpb24ueiA9IHRoaXMuX2NhbWVyYUdwcy5jb21wdXRlRGlzdGFuY2VNZXRlcnModGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3JkcywgZHN0Q29vcmRzKTtcblxuICAgICAgICBwb3NpdGlvbi56ICo9IHRoaXMuZGF0YS5sYXRpdHVkZSA+IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMubGF0aXR1ZGUgPyAtMSA6IDE7XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uLnkgIT09IDApIHtcbiAgICAgICAgICAgIHZhciBhbHRpdHVkZSA9IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMuYWx0aXR1ZGUgIT09IHVuZGVmaW5lZCA/IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMuYWx0aXR1ZGUgOiAwO1xuICAgICAgICAgICAgcG9zaXRpb24ueSA9IHBvc2l0aW9uLnkgLSBhbHRpdHVkZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBlbGVtZW50J3MgcG9zaXRpb24gaW4gM0Qgd29ybGRcbiAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgcG9zaXRpb24pO1xuICAgIH0sXG59KTtcblxuLyoqXG4gKiBGb3JtYXQgZGlzdGFuY2VzIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBkaXN0YW5jZVxuICovXG5mdW5jdGlvbiBmb3JtYXREaXN0YW5jZShkaXN0YW5jZSkge1xuICAgIGRpc3RhbmNlID0gZGlzdGFuY2UudG9GaXhlZCgwKTtcblxuICAgIGlmIChkaXN0YW5jZSA+PSAxMDAwKSB7XG4gICAgICAgIHJldHVybiAoZGlzdGFuY2UgLyAxMDAwKSArICcga2lsb21ldGVycyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc3RhbmNlICsgJyBtZXRlcnMnO1xufTtcbiIsIi8qKiBncHMtcHJvamVjdGVkLWNhbWVyYVxuICpcbiAqIGJhc2VkIG9uIHRoZSBvcmlnaW5hbCBncHMtY2FtZXJhLCBtb2RpZmllZCBieSBuaWNrdyAwMi8wNC8yMFxuICpcbiAqIFJhdGhlciB0aGFuIGtlZXBpbmcgdHJhY2sgb2YgcG9zaXRpb24gYnkgY2FsY3VsYXRpbmcgdGhlIGRpc3RhbmNlIG9mXG4gKiBlbnRpdGllcyBvciB0aGUgY3VycmVudCBsb2NhdGlvbiB0byB0aGUgb3JpZ2luYWwgbG9jYXRpb24sIHRoaXMgdmVyc2lvblxuICogbWFrZXMgdXNlIG9mIHRoZSBcIkdvb2dsZVwiIFNwaGVyaWNhbCBNZXJjYWN0b3IgcHJvamVjdGlvbiwgYWthIGVwc2c6Mzg1Ny5cbiAqXG4gKiBUaGUgb3JpZ2luYWwgcG9zaXRpb24gKGxhdC9sb24pIGlzIHByb2plY3RlZCBpbnRvIFNwaGVyaWNhbCBNZXJjYXRvciBhbmRcbiAqIHN0b3JlZC5cbiAqXG4gKiBUaGVuLCB3aGVuIHdlIHJlY2VpdmUgYSBuZXcgcG9zaXRpb24gKGxhdC9sb24pLCB0aGlzIG5ldyBwb3NpdGlvbiBpc1xuICogcHJvamVjdGVkIGludG8gU3BoZXJpY2FsIE1lcmNhdG9yIGFuZCB0aGVuIGl0cyB3b3JsZCBwb3NpdGlvbiBjYWxjdWxhdGVkXG4gKiBieSBjb21wYXJpbmcgYWdhaW5zdCB0aGUgb3JpZ2luYWwgcG9zaXRpb24uXG4gKlxuICogVGhlIHNhbWUgaXMgYWxzbyB0aGUgY2FzZSBmb3IgJ2VudGl0eS1wbGFjZXMnOyB3aGVuIHRoZXNlIGFyZSBhZGRlZCwgdGhlaXJcbiAqIFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZHMgYXJlIGNhbGN1bGF0ZWQgKHNlZSBncHMtcHJvamVjdGVkLWVudGl0eS1wbGFjZSkuXG4gKlxuICogU3BoZXJpY2FsIE1lcmNhdG9yIHVuaXRzIGFyZSBjbG9zZSB0bywgYnV0IG5vdCBleGFjdGx5LCBtZXRyZXMsIGFuZCBhcmVcbiAqIGhlYXZpbHkgZGlzdG9ydGVkIG5lYXIgdGhlIHBvbGVzLiBOb25ldGhlbGVzcyB0aGV5IGFyZSBhIGdvb2QgYXBwcm94aW1hdGlvblxuICogZm9yIG1hbnkgYXJlYXMgb2YgdGhlIHdvcmxkIGFuZCBhcHBlYXIgbm90IHRvIGNhdXNlIHVuYWNjZXB0YWJsZSBkaXN0b3J0aW9uc1xuICogd2hlbiB1c2VkIGFzIHRoZSB1bml0cyBmb3IgQVIgYXBwcy5cbiAqXG4gKiBVUERBVEVTIDI4LzA4LzIwOlxuICpcbiAqIC0gYWRkIGdwc01pbkRpc3RhbmNlIGFuZCBncHNUaW1lSW50ZXJ2YWwgcHJvcGVydGllcyB0byBjb250cm9sIGhvd1xuICogZnJlcXVlbnRseSBHUFMgdXBkYXRlcyBhcmUgcHJvY2Vzc2VkLiBBaW0gaXMgdG8gcHJldmVudCAnc3R1dHRlcmluZydcbiAqIGVmZmVjdHMgd2hlbiBjbG9zZSB0byBBUiBjb250ZW50IGR1ZSB0byBjb250aW51b3VzIHNtYWxsIGNoYW5nZXMgaW5cbiAqIGxvY2F0aW9uLlxuICovXG5cbmltcG9ydCAqIGFzIEFGUkFNRSBmcm9tICdhZnJhbWUnXG5cbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudCgnZ3BzLXByb2plY3RlZC1jYW1lcmEnLCB7XG4gICAgX3dhdGNoUG9zaXRpb25JZDogbnVsbCxcbiAgICBvcmlnaW5Db29yZHM6IG51bGwsIC8vIG9yaWdpbmFsIGNvb3JkcyBub3cgaW4gU3BoZXJpY2FsIE1lcmNhdG9yXG4gICAgY3VycmVudENvb3JkczogbnVsbCxcbiAgICBsb29rQ29udHJvbHM6IG51bGwsXG4gICAgaGVhZGluZzogbnVsbCxcbiAgICBzY2hlbWE6IHtcbiAgICAgICAgc2ltdWxhdGVMYXRpdHVkZToge1xuICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICB9LFxuICAgICAgICBzaW11bGF0ZUxvbmdpdHVkZToge1xuICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICB9LFxuICAgICAgICBzaW11bGF0ZUFsdGl0dWRlOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIHBvc2l0aW9uTWluQWNjdXJhY3k6IHtcbiAgICAgICAgICAgIHR5cGU6ICdpbnQnLFxuICAgICAgICAgICAgZGVmYXVsdDogMTAwLFxuICAgICAgICB9LFxuICAgICAgICBhbGVydDoge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIG1pbkRpc3RhbmNlOiB7XG4gICAgICAgICAgICB0eXBlOiAnaW50JyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIGdwc01pbkRpc3RhbmNlOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDBcbiAgICAgICAgfSxcbiAgICAgICAgZ3BzVGltZUludGVydmFsOiB7XG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDBcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPT0gMCAmJiB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT09IDApIHtcbiAgICAgICAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jdXJyZW50Q29vcmRzIHx8IHt9KTtcbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb24ubG9uZ2l0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlO1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5sYXRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlO1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29vcmRzID0gbG9jYWxQb3NpdGlvbjtcblxuICAgICAgICAgICAgLy8gcmUtdHJpZ2dlciBpbml0aWFsaXphdGlvbiBmb3IgbmV3IG9yaWdpblxuICAgICAgICAgICAgdGhpcy5vcmlnaW5Db29yZHMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5lbC5jb21wb25lbnRzWydhcmpzLWxvb2stY29udHJvbHMnXSAmJiAhdGhpcy5lbC5jb21wb25lbnRzWydsb29rLWNvbnRyb2xzJ10pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGFzdFBvc2l0aW9uID0ge1xuICAgICAgICAgICAgbGF0aXR1ZGU6IDAsXG4gICAgICAgICAgICBsb25naXR1ZGU6IDBcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xuICAgICAgICB0aGlzLmxvYWRlci5jbGFzc0xpc3QuYWRkKCdhcmpzLWxvYWRlcicpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMubG9hZGVyKTtcblxuICAgICAgICB0aGlzLm9uR3BzRW50aXR5UGxhY2VBZGRlZCA9IHRoaXMuX29uR3BzRW50aXR5UGxhY2VBZGRlZC5iaW5kKHRoaXMpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZ3BzLWVudGl0eS1wbGFjZS1hZGRlZCcsIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkKTtcblxuICAgICAgICB0aGlzLmxvb2tDb250cm9scyA9IHRoaXMuZWwuY29tcG9uZW50c1snYXJqcy1sb29rLWNvbnRyb2xzJ10gfHwgdGhpcy5lbC5jb21wb25lbnRzWydsb29rLWNvbnRyb2xzJ107XG5cbiAgICAgICAgLy8gbGlzdGVuIHRvIGRldmljZW9yaWVudGF0aW9uIGV2ZW50XG4gICAgICAgIHZhciBldmVudE5hbWUgPSB0aGlzLl9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZSgpO1xuICAgICAgICB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uID0gdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbi5iaW5kKHRoaXMpO1xuXG4gICAgICAgIC8vIGlmIFNhZmFyaVxuICAgICAgICBpZiAoISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9WZXJzaW9uXFwvW1xcZC5dKy4qU2FmYXJpLykpIHtcbiAgICAgICAgICAgIC8vIGlPUyAxMytcbiAgICAgICAgICAgIGlmICh0eXBlb2YgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXF1ZXN0aW5nIGRldmljZSBvcmllbnRhdGlvbiBwZXJtaXNzaW9ucy4uLicpXG4gICAgICAgICAgICAgICAgICAgIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBoYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbigpIHsgaGFuZGxlcigpIH0sIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIGFsZXJ0KCdBZnRlciBjYW1lcmEgcGVybWlzc2lvbiBwcm9tcHQsIHBsZWFzZSB0YXAgdGhlIHNjcmVlbiB0byBhY3RpdmF0ZSBnZW9sb2NhdGlvbi4nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnUGxlYXNlIGVuYWJsZSBkZXZpY2Ugb3JpZW50YXRpb24gaW4gU2V0dGluZ3MgPiBTYWZhcmkgPiBNb3Rpb24gJiBPcmllbnRhdGlvbiBBY2Nlc3MuJylcbiAgICAgICAgICAgICAgICB9LCA3NTApO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IHRoaXMuX2luaXRXYXRjaEdQUyhmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0ge1xuICAgICAgICAgICAgICAgIGxhdGl0dWRlOiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgICAgIGFsdGl0dWRlOiBwb3NpdGlvbi5jb29yZHMuYWx0aXR1ZGUsXG4gICAgICAgICAgICAgICAgYWNjdXJhY3k6IHBvc2l0aW9uLmNvb3Jkcy5hY2N1cmFjeSxcbiAgICAgICAgICAgICAgICBhbHRpdHVkZUFjY3VyYWN5OiBwb3NpdGlvbi5jb29yZHMuYWx0aXR1ZGVBY2N1cmFjeSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGxvY2FsUG9zaXRpb24uYWx0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlICE9PSAwICYmIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGxvY2FsUG9zaXRpb24ubGF0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZTtcbiAgICAgICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmxvbmdpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENvb3JkcyA9IGxvY2FsUG9zaXRpb247XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RNb3ZlZCA9IHRoaXMuX2hhdmVyc2luZURpc3QoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHNcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYoZGlzdE1vdmVkID49IHRoaXMuZGF0YS5ncHNNaW5EaXN0YW5jZSB8fCAhdGhpcy5vcmlnaW5Db29yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxhdGl0dWRlXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICB0aWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuaGVhZGluZyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZVJvdGF0aW9uKCk7XG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl93YXRjaFBvc2l0aW9uSWQpIHtcbiAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5jbGVhcldhdGNoKHRoaXMuX3dhdGNoUG9zaXRpb25JZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbnVsbDtcblxuICAgICAgICB2YXIgZXZlbnROYW1lID0gdGhpcy5fZ2V0RGV2aWNlT3JpZW50YXRpb25FdmVudE5hbWUoKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLCBmYWxzZSk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdncHMtZW50aXR5LXBsYWNlLWFkZGVkJywgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgZGV2aWNlIG9yaWVudGF0aW9uIGV2ZW50IG5hbWUsIGRlcGVuZHMgb24gYnJvd3NlciBpbXBsZW1lbnRhdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBldmVudCBuYW1lXG4gICAgICovXG4gICAgX2dldERldmljZU9yaWVudGF0aW9uRXZlbnROYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCdvbmRldmljZW9yaWVudGF0aW9uYWJzb2x1dGUnIGluIHdpbmRvdykge1xuICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSA9ICdkZXZpY2VvcmllbnRhdGlvbmFic29sdXRlJ1xuICAgICAgICB9IGVsc2UgaWYgKCdvbmRldmljZW9yaWVudGF0aW9uJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSAnZGV2aWNlb3JpZW50YXRpb24nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gJydcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbXBhc3Mgbm90IHN1cHBvcnRlZCcpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXZlbnROYW1lXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBjdXJyZW50IHVzZXIgcG9zaXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvblN1Y2Nlc3NcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkVycm9yXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICovXG4gICAgX2luaXRXYXRjaEdQUzogZnVuY3Rpb24ob25TdWNjZXNzLCBvbkVycm9yKSB7XG4gICAgICAgIGlmICghb25FcnJvcikge1xuICAgICAgICAgICAgb25FcnJvciA9IGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignRVJST1IoJyArIGVyci5jb2RlICsgJyk6ICcgKyBlcnIubWVzc2FnZSlcblxuICAgICAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBVc2VyIGRlbmllZCBHZW9Mb2NhdGlvbiwgbGV0IHRoZWlyIGtub3cgdGhhdFxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnUGxlYXNlIGFjdGl2YXRlIEdlb2xvY2F0aW9uIGFuZCByZWZyZXNoIHRoZSBwYWdlLiBJZiBpdCBpcyBhbHJlYWR5IGFjdGl2ZSwgcGxlYXNlIGNoZWNrIHBlcm1pc3Npb25zIGZvciB0aGlzIHdlYnNpdGUuJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0Nhbm5vdCByZXRyaWV2ZSBHUFMgcG9zaXRpb24uIFNpZ25hbCBpcyBhYnNlbnQuJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdnZW9sb2NhdGlvbicgaW4gbmF2aWdhdG9yID09PSBmYWxzZSkge1xuICAgICAgICAgICAgb25FcnJvcih7IGNvZGU6IDAsIG1lc3NhZ2U6ICdHZW9sb2NhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGJ5IHlvdXIgYnJvd3NlcicgfSk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvR2VvbG9jYXRpb24vd2F0Y2hQb3NpdGlvblxuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLmdlb2xvY2F0aW9uLndhdGNoUG9zaXRpb24ob25TdWNjZXNzLCBvbkVycm9yLCB7XG4gICAgICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsXG4gICAgICAgICAgICBtYXhpbXVtQWdlOiB0aGlzLmRhdGEuZ3BzVGltZUludGVydmFsLFxuICAgICAgICAgICAgdGltZW91dDogMjcwMDAsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdXNlciBwb3NpdGlvbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIF91cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGRvbid0IHVwZGF0ZSBpZiBhY2N1cmFjeSBpcyBub3QgZ29vZCBlbm91Z2hcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENvb3Jkcy5hY2N1cmFjeSA+IHRoaXMuZGF0YS5wb3NpdGlvbk1pbkFjY3VyYWN5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmFsZXJ0ICYmICFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxlcnQtcG9wdXAnKSkge1xuICAgICAgICAgICAgICAgIHZhciBwb3B1cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIHBvcHVwLmlubmVySFRNTCA9ICdHUFMgc2lnbmFsIGlzIHZlcnkgcG9vci4gVHJ5IG1vdmUgb3V0ZG9vciBvciB0byBhbiBhcmVhIHdpdGggYSBiZXR0ZXIgc2lnbmFsLidcbiAgICAgICAgICAgICAgICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2FsZXJ0LXBvcHVwJyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwb3B1cCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbGVydC1wb3B1cCcpO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q29vcmRzLmFjY3VyYWN5IDw9IHRoaXMuZGF0YS5wb3NpdGlvbk1pbkFjY3VyYWN5ICYmIGFsZXJ0UG9wdXApIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYWxlcnRQb3B1cCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICAgICAgICAvLyBmaXJzdCBjYW1lcmEgaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICAgIC8vIE5vdyBzdG9yZSBvcmlnaW5Db29yZHMgYXMgUFJPSkVDVEVEIG9yaWdpbmFsIGxhdC9sb24sIHNvIHRoYXRcbiAgICAgICAgICAgIC8vIHdlIGNhbiBzZXQgdGhlIHdvcmxkIG9yaWdpbiB0byB0aGUgb3JpZ2luYWwgcG9zaXRpb24gaW4gXCJtZXRyZXNcIlxuICAgICAgICAgICAgdGhpcy5vcmlnaW5Db29yZHMgPSB0aGlzLl9wcm9qZWN0KHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSwgdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZSk7XG4gICAgICAgICAgICB0aGlzLl9zZXRQb3NpdGlvbigpO1xuXG4gICAgICAgICAgICB2YXIgbG9hZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFyanMtbG9hZGVyJyk7XG4gICAgICAgICAgICBpZiAobG9hZGVyKSB7XG4gICAgICAgICAgICAgICAgbG9hZGVyLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXQnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGN1cnJlbnQgcG9zaXRpb24gKGluIHdvcmxkIGNvb3JkcywgYmFzZWQgb24gU3BoZXJpY2FsIE1lcmNhdG9yKVxuICAgICAqXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgX3NldFBvc2l0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJyk7XG5cbiAgICAgICAgdmFyIHdvcmxkQ29vcmRzID0gdGhpcy5sYXRMb25Ub1dvcmxkKHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSwgdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZSk7XG5cbiAgICAgICAgcG9zaXRpb24ueCA9IHdvcmxkQ29vcmRzWzBdO1xuICAgICAgICBwb3NpdGlvbi56ID0gd29ybGRDb29yZHNbMV07XG5cbiAgICAgICAgLy8gdXBkYXRlIHBvc2l0aW9uXG4gICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdwb3NpdGlvbicsIHBvc2l0aW9uKTtcblxuICAgICAgICAvLyBhZGQgdGhlIHNwaG1lcmMgcG9zaXRpb24gdG8gdGhlIGV2ZW50IChmb3IgdGVzdGluZyBvbmx5KVxuICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2dwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uJywgeyBkZXRhaWw6IHsgcG9zaXRpb246IHRoaXMuY3VycmVudENvb3Jkcywgb3JpZ2luOiB0aGlzLm9yaWdpbkNvb3JkcyB9IH0pKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZGlzdGFuY2UgaW4gbWV0ZXJzIGJldHdlZW4gY2FtZXJhIGFuZCBkZXN0aW5hdGlvbiBpbnB1dC5cbiAgICAgKlxuICAgICAqIEFzc3VtZSB3ZSBhcmUgdXNpbmcgYSBtZXRyZS1iYXNlZCBwcm9qZWN0aW9uLiBOb3QgYWxsICdtZXRyZS1iYXNlZCdcbiAgICAgKiBwcm9qZWN0aW9ucyBnaXZlIGV4YWN0IG1ldHJlcywgZS5nLiBTcGhlcmljYWwgTWVyY2F0b3IsIGJ1dCBpdCBhcHBlYXJzXG4gICAgICogY2xvc2UgZW5vdWdoIHRvIGJlIHVzZWQgZm9yIEFSIGF0IGxlYXN0IGluIG1pZGRsZSB0ZW1wZXJhdGVcbiAgICAgKiBsYXRpdHVkZXMgKDQwIC0gNTUpLiBJdCBpcyBoZWF2aWx5IGRpc3RvcnRlZCBuZWFyIHRoZSBwb2xlcywgaG93ZXZlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UG9zaXRpb259IGRlc3RcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzUGxhY2VcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IGRpc3RhbmNlIHwgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAgKi9cbiAgICBjb21wdXRlRGlzdGFuY2VNZXRlcnM6IGZ1bmN0aW9uKGRlc3QsIGlzUGxhY2UpIHtcbiAgICAgICAgdmFyIHNyYyA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicG9zaXRpb25cIik7XG4gICAgICAgIHZhciBkeCA9IGRlc3QueCAtIHNyYy54O1xuICAgICAgICB2YXIgZHogPSBkZXN0LnogLSBzcmMuejtcbiAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeiAqIGR6KTtcblxuICAgICAgICAvLyBpZiBmdW5jdGlvbiBoYXMgYmVlbiBjYWxsZWQgZm9yIGEgcGxhY2UsIGFuZCBpZiBpdCdzIHRvbyBuZWFyIGFuZCBhIG1pbiBkaXN0YW5jZSBoYXMgYmVlbiBzZXQsXG4gICAgICAgIC8vIHJldHVybiBtYXggZGlzdGFuY2UgcG9zc2libGUgLSB0byBiZSBoYW5kbGVkIGJ5IHRoZSAgbWV0aG9kIGNhbGxlclxuICAgICAgICBpZiAoaXNQbGFjZSAmJiB0aGlzLmRhdGEubWluRGlzdGFuY2UgJiYgdGhpcy5kYXRhLm1pbkRpc3RhbmNlID4gMCAmJiBkaXN0YW5jZSA8IHRoaXMuZGF0YS5taW5EaXN0YW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRpc3RhbmNlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgbGF0aXR1ZGUvbG9uZ2l0dWRlIHRvIE9wZW5HTCB3b3JsZCBjb29yZGluYXRlcy5cbiAgICAgKlxuICAgICAqIEZpcnN0IHByb2plY3RzIGxhdC9sb24gdG8gYWJzb2x1dGUgU3BoZXJpY2FsIE1lcmNhdG9yIGFuZCB0aGVuXG4gICAgICogY2FsY3VsYXRlcyB0aGUgd29ybGQgY29vcmRpbmF0ZXMgYnkgY29tcGFyaW5nIHRoZSBTcGhlcmljYWwgTWVyY2F0b3JcbiAgICAgKiBjb29yZGluYXRlcyB3aXRoIHRoZSBTcGhlcmljYWwgTWVyY2F0b3IgY29vcmRpbmF0ZXMgb2YgdGhlIG9yaWdpbiBwb2ludC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsYXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbG9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7YXJyYXl9IHdvcmxkIGNvb3JkaW5hdGVzXG4gICAgICovXG4gICAgbGF0TG9uVG9Xb3JsZDogZnVuY3Rpb24obGF0LCBsb24pIHtcbiAgICAgICAgdmFyIHByb2plY3RlZCA9IHRoaXMuX3Byb2plY3QobGF0LCBsb24pO1xuICAgICAgICAvLyBTaWduIG9mIHogbmVlZHMgdG8gYmUgcmV2ZXJzZWQgY29tcGFyZWQgdG8gcHJvamVjdGVkIGNvb3JkaW5hdGVzXG4gICAgICAgIHJldHVybiBbIHByb2plY3RlZFswXSAtIHRoaXMub3JpZ2luQ29vcmRzWzBdLCAtKHByb2plY3RlZFsxXSAtIHRoaXMub3JpZ2luQ29vcmRzWzFdKV07XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBsYXRpdHVkZS9sb25naXR1ZGUgdG8gU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkaW5hdGVzLlxuICAgICAqIEFsZ29yaXRobSBpcyB1c2VkIGluIHNldmVyYWwgT3BlblN0cmVldE1hcC1yZWxhdGVkIGFwcGxpY2F0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsYXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbG9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7YXJyYXl9IFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZGluYXRlc1xuICAgICAqL1xuICAgIF9wcm9qZWN0OiBmdW5jdGlvbihsYXQsIGxvbikge1xuICAgICAgICBjb25zdCBIQUxGX0VBUlRIID0gMjAwMzc1MDguMzQ7XG5cbiAgICAgICAgLy8gQ29udmVydCB0aGUgc3VwcGxpZWQgY29vcmRzIHRvIFNwaGVyaWNhbCBNZXJjYXRvciAoRVBTRzozODU3KSwgYWxzb1xuICAgICAgICAvLyBrbm93biBhcyAnR29vZ2xlIFByb2plY3Rpb24nLCB1c2luZyB0aGUgYWxnb3JpdGhtIHVzZWQgZXh0ZW5zaXZlbHlcbiAgICAgICAgLy8gaW4gdmFyaW91cyBPcGVuU3RyZWV0TWFwIHNvZnR3YXJlLlxuICAgICAgICB2YXIgeSA9IE1hdGgubG9nKE1hdGgudGFuKCg5MCArIGxhdCkgKiBNYXRoLlBJIC8gMzYwLjApKSAvIChNYXRoLlBJIC8gMTgwLjApO1xuICAgICAgICByZXR1cm4gWyhsb24gLyAxODAuMCkgKiBIQUxGX0VBUlRILCB5ICogSEFMRl9FQVJUSCAvIDE4MC4wXTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZGluYXRlcyB0byBsYXRpdHVkZS9sb25naXR1ZGUuXG4gICAgICogQWxnb3JpdGhtIGlzIHVzZWQgaW4gc2V2ZXJhbCBPcGVuU3RyZWV0TWFwLXJlbGF0ZWQgYXBwbGljYXRpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwaGVyaWNhbCBtZXJjYXRvciBlYXN0aW5nXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHNwaGVyaWNhbCBtZXJjYXRvciBub3J0aGluZ1xuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gbG9uL2xhdFxuICAgICAqL1xuICAgIF91bnByb2plY3Q6IGZ1bmN0aW9uKGUsIG4pIHtcbiAgICAgICAgY29uc3QgSEFMRl9FQVJUSCA9IDIwMDM3NTA4LjM0O1xuICAgICAgICB2YXIgeXAgPSAobiAvIEhBTEZfRUFSVEgpICogMTgwLjA7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb25naXR1ZGU6IChlIC8gSEFMRl9FQVJUSCkgKiAxODAuMCxcbiAgICAgICAgICAgIGxhdGl0dWRlOiAxODAuMCAvIE1hdGguUEkgKiAoMiAqIE1hdGguYXRhbihNYXRoLmV4cCh5cCAqIE1hdGguUEkgLyAxODAuMCkpIC0gTWF0aC5QSSAvIDIpXG4gICAgICAgIH07XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDb21wdXRlIGNvbXBhc3MgaGVhZGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiZXRhXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGdhbW1hXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjb21wYXNzIGhlYWRpbmdcbiAgICAgKi9cbiAgICBfY29tcHV0ZUNvbXBhc3NIZWFkaW5nOiBmdW5jdGlvbihhbHBoYSwgYmV0YSwgZ2FtbWEpIHtcblxuICAgICAgICAvLyBDb252ZXJ0IGRlZ3JlZXMgdG8gcmFkaWFuc1xuICAgICAgICB2YXIgYWxwaGFSYWQgPSBhbHBoYSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICAgICAgdmFyIGJldGFSYWQgPSBiZXRhICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICB2YXIgZ2FtbWFSYWQgPSBnYW1tYSAqIChNYXRoLlBJIC8gMTgwKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgZXF1YXRpb24gY29tcG9uZW50c1xuICAgICAgICB2YXIgY0EgPSBNYXRoLmNvcyhhbHBoYVJhZCk7XG4gICAgICAgIHZhciBzQSA9IE1hdGguc2luKGFscGhhUmFkKTtcbiAgICAgICAgdmFyIHNCID0gTWF0aC5zaW4oYmV0YVJhZCk7XG4gICAgICAgIHZhciBjRyA9IE1hdGguY29zKGdhbW1hUmFkKTtcbiAgICAgICAgdmFyIHNHID0gTWF0aC5zaW4oZ2FtbWFSYWQpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBBLCBCLCBDIHJvdGF0aW9uIGNvbXBvbmVudHNcbiAgICAgICAgdmFyIHJBID0gLSBjQSAqIHNHIC0gc0EgKiBzQiAqIGNHO1xuICAgICAgICB2YXIgckIgPSAtIHNBICogc0cgKyBjQSAqIHNCICogY0c7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGNvbXBhc3MgaGVhZGluZ1xuICAgICAgICB2YXIgY29tcGFzc0hlYWRpbmcgPSBNYXRoLmF0YW4ockEgLyByQik7XG5cbiAgICAgICAgLy8gQ29udmVydCBmcm9tIGhhbGYgdW5pdCBjaXJjbGUgdG8gd2hvbGUgdW5pdCBjaXJjbGVcbiAgICAgICAgaWYgKHJCIDwgMCkge1xuICAgICAgICAgICAgY29tcGFzc0hlYWRpbmcgKz0gTWF0aC5QSTtcbiAgICAgICAgfSBlbHNlIGlmIChyQSA8IDApIHtcbiAgICAgICAgICAgIGNvbXBhc3NIZWFkaW5nICs9IDIgKiBNYXRoLlBJO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29udmVydCByYWRpYW5zIHRvIGRlZ3JlZXNcbiAgICAgICAgY29tcGFzc0hlYWRpbmcgKj0gMTgwIC8gTWF0aC5QSTtcblxuICAgICAgICByZXR1cm4gY29tcGFzc0hlYWRpbmc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXIgZm9yIGRldmljZSBvcmllbnRhdGlvbiBldmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgX29uRGV2aWNlT3JpZW50YXRpb246IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC53ZWJraXRDb21wYXNzSGVhZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQud2Via2l0Q29tcGFzc0FjY3VyYWN5IDwgNTApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWRpbmcgPSBldmVudC53ZWJraXRDb21wYXNzSGVhZGluZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCd3ZWJraXRDb21wYXNzQWNjdXJhY3kgaXMgZXZlbnQud2Via2l0Q29tcGFzc0FjY3VyYWN5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuYWxwaGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5hYnNvbHV0ZSA9PT0gdHJ1ZSB8fCBldmVudC5hYnNvbHV0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkaW5nID0gdGhpcy5fY29tcHV0ZUNvbXBhc3NIZWFkaW5nKGV2ZW50LmFscGhhLCBldmVudC5iZXRhLCBldmVudC5nYW1tYSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignZXZlbnQuYWJzb2x1dGUgPT09IGZhbHNlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2V2ZW50LmFscGhhID09PSBudWxsJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHVzZXIgcm90YXRpb24gZGF0YS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIF91cGRhdGVSb3RhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoZWFkaW5nID0gMzYwIC0gdGhpcy5oZWFkaW5nO1xuICAgICAgICB2YXIgY2FtZXJhUm90YXRpb24gPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSgncm90YXRpb24nKS55O1xuICAgICAgICB2YXIgeWF3Um90YXRpb24gPSBUSFJFRS5NYXRoLnJhZFRvRGVnKHRoaXMubG9va0NvbnRyb2xzLnlhd09iamVjdC5yb3RhdGlvbi55KTtcbiAgICAgICAgdmFyIG9mZnNldCA9IChoZWFkaW5nIC0gKGNhbWVyYVJvdGF0aW9uIC0geWF3Um90YXRpb24pKSAlIDM2MDtcbiAgICAgICAgdGhpcy5sb29rQ29udHJvbHMueWF3T2JqZWN0LnJvdGF0aW9uLnkgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKG9mZnNldCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZSBoYXZlcnNpbmUgZGlzdGFuY2UgYmV0d2VlbiB0d28gbGF0L2xvbiBwYWlycy5cbiAgICAgKlxuICAgICAqIFRha2VuIGZyb20gZ3BzLWNhbWVyYVxuICAgICAqL1xuICAgICBfaGF2ZXJzaW5lRGlzdDogZnVuY3Rpb24oc3JjLCBkZXN0KSB7XG4gICAgICAgIHZhciBkbG9uZ2l0dWRlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChkZXN0LmxvbmdpdHVkZSAtIHNyYy5sb25naXR1ZGUpO1xuICAgICAgICB2YXIgZGxhdGl0dWRlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChkZXN0LmxhdGl0dWRlIC0gc3JjLmxhdGl0dWRlKTtcblxuICAgICAgICB2YXIgYSA9IChNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpKSArIE1hdGguY29zKFRIUkVFLk1hdGguZGVnVG9SYWQoc3JjLmxhdGl0dWRlKSkgKiBNYXRoLmNvcyhUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpKSAqIChNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikgKiBNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikpO1xuICAgICAgICB2YXIgYW5nbGUgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgICAgICByZXR1cm4gYW5nbGUgKiA2MzcxMDAwO1xuICAgIH0sXG5cbiAgICBfb25HcHNFbnRpdHlQbGFjZUFkZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gaWYgcGxhY2VzIGFyZSBhZGRlZCBhZnRlciBjYW1lcmEgaW5pdGlhbGl6YXRpb24gaXMgZmluaXNoZWRcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luQ29vcmRzKSB7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2dwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldCcpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5sb2FkZXIgJiYgdGhpcy5sb2FkZXIucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLmxvYWRlcilcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiLyoqIGdwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlXG4gKlxuICogYmFzZWQgb24gdGhlIG9yaWdpbmFsIGdwcy1lbnRpdHktcGxhY2UsIG1vZGlmaWVkIGJ5IG5pY2t3IDAyLzA0LzIwXG4gKlxuICogUmF0aGVyIHRoYW4ga2VlcGluZyB0cmFjayBvZiBwb3NpdGlvbiBieSBjYWxjdWxhdGluZyB0aGUgZGlzdGFuY2Ugb2ZcbiAqIGVudGl0aWVzIG9yIHRoZSBjdXJyZW50IGxvY2F0aW9uIHRvIHRoZSBvcmlnaW5hbCBsb2NhdGlvbiwgdGhpcyB2ZXJzaW9uXG4gKiBtYWtlcyB1c2Ugb2YgdGhlIFwiR29vZ2xlXCIgU3BoZXJpY2FsIE1lcmNhY3RvciBwcm9qZWN0aW9uLCBha2EgZXBzZzozODU3LlxuICpcbiAqIFRoZSBvcmlnaW5hbCBsb2NhdGlvbiBvbiBzdGFydHVwIChsYXQvbG9uKSBpcyBwcm9qZWN0ZWQgaW50byBTcGhlcmljYWwgXG4gKiBNZXJjYXRvciBhbmQgc3RvcmVkLlxuICpcbiAqIFdoZW4gJ2VudGl0eS1wbGFjZXMnIGFyZSBhZGRlZCwgdGhlaXIgU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkcyBhcmUgXG4gKiBjYWxjdWxhdGVkIGFuZCBjb252ZXJ0ZWQgaW50byB3b3JsZCBjb29yZGluYXRlcywgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbmFsXG4gKiBwb3NpdGlvbiwgdXNpbmcgdGhlIFNwaGVyaWNhbCBNZXJjYXRvciBwcm9qZWN0aW9uIGNhbGN1bGF0aW9uIGluXG4gKiBncHMtcHJvamVjdGVkLWNhbWVyYS5cbiAqXG4gKiBTcGhlcmljYWwgTWVyY2F0b3IgdW5pdHMgYXJlIGNsb3NlIHRvLCBidXQgbm90IGV4YWN0bHksIG1ldHJlcywgYW5kIGFyZVxuICogaGVhdmlseSBkaXN0b3J0ZWQgbmVhciB0aGUgcG9sZXMuIE5vbmV0aGVsZXNzIHRoZXkgYXJlIGEgZ29vZCBhcHByb3hpbWF0aW9uXG4gKiBmb3IgbWFueSBhcmVhcyBvZiB0aGUgd29ybGQgYW5kIGFwcGVhciBub3QgdG8gY2F1c2UgdW5hY2NlcHRhYmxlIGRpc3RvcnRpb25zXG4gKiB3aGVuIHVzZWQgYXMgdGhlIHVuaXRzIGZvciBBUiBhcHBzLlxuICovXG5pbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSAnYWZyYW1lJ1xuXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoJ2dwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlJywge1xuICAgIF9jYW1lcmFHcHM6IG51bGwsXG4gICAgc2NoZW1hOiB7XG4gICAgICAgIGxvbmdpdHVkZToge1xuICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICB9LFxuICAgICAgICBsYXRpdHVkZToge1xuICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICB9XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjbGVhbmluZyBsaXN0ZW5lcnMgd2hlbiB0aGUgZW50aXR5IGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvbicsIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lcik7XG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gVXNlZCBub3cgdG8gZ2V0IHRoZSBHUFMgY2FtZXJhIHdoZW4gaXQncyBiZWVuIHNldHVwXG4gICAgICAgIHRoaXMuY29vcmRTZXRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fY2FtZXJhR3BzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNhbWVyYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tncHMtcHJvamVjdGVkLWNhbWVyYV0nKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNhbWVyYS5jb21wb25lbnRzWydncHMtcHJvamVjdGVkLWNhbWVyYSddKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2dwcy1wcm9qZWN0ZWQtY2FtZXJhIG5vdCBpbml0aWFsaXplZCcpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FtZXJhR3BzID0gY2FtZXJhLmNvbXBvbmVudHNbJ2dwcy1wcm9qZWN0ZWQtY2FtZXJhJ107XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG5cblxuICAgICAgICAvLyB1cGRhdGUgcG9zaXRpb24gbmVlZHMgdG8gd29ycnkgYWJvdXQgZGlzdGFuY2UgYnV0IG5vdGhpbmcgZWxzZT9cbiAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyID0gKGV2KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZGF0YSB8fCAhdGhpcy5fY2FtZXJhR3BzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZHN0Q29vcmRzID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJyk7XG5cbiAgICAgICAgICAgIC8vIGl0J3MgYWN0dWFsbHkgYSAnZGlzdGFuY2UgcGxhY2UnLCBidXQgd2UgZG9uJ3QgY2FsbCBpdCB3aXRoIGxhc3QgcGFyYW0sIGJlY2F1c2Ugd2Ugd2FudCB0byByZXRyaWV2ZSBkaXN0YW5jZSBldmVuIGlmIGl0J3MgPCBtaW5EaXN0YW5jZSBwcm9wZXJ0eVxuICAgICAgICAgICAgLy8gX2NvbXB1dGVEaXN0YW5jZU1ldGVycyBpcyBub3cgZ29pbmcgdG8gdXNlIHRoZSBwcm9qZWN0ZWRcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZUZvck1zZyA9IHRoaXMuX2NhbWVyYUdwcy5jb21wdXRlRGlzdGFuY2VNZXRlcnMoZHN0Q29vcmRzKTtcblxuICAgICAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2Rpc3RhbmNlJywgZGlzdGFuY2VGb3JNc2cpO1xuICAgICAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2Rpc3RhbmNlTXNnJywgZm9ybWF0RGlzdGFuY2UoZGlzdGFuY2VGb3JNc2cpKTtcblxuICAgICAgICAgICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZ3BzLWVudGl0eS1wbGFjZS11cGRhdGUtcG9zaXRvbicsIHsgZGV0YWlsOiB7IGRpc3RhbmNlOiBkaXN0YW5jZUZvck1zZyB9IH0pKTtcblxuICAgICAgICAgICAgdmFyIGFjdHVhbERpc3RhbmNlID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhkc3RDb29yZHMsIHRydWUpO1xuXG4gICAgICAgICAgICBpZiAoYWN0dWFsRGlzdGFuY2UgPT09IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlRm9yTWluRGlzdGFuY2UodGhpcy5lbCwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUZvck1pbkRpc3RhbmNlKHRoaXMuZWwsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXRhaW4gYXMgdGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSBHUFMgY2FtZXJhIGlzIHNldCB1cFxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0JywgdGhpcy5jb29yZFNldExpc3RlbmVyKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2dwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uJywgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyKTtcblxuICAgICAgICB0aGlzLl9wb3NpdGlvblhEZWJ1ZyA9IDA7XG5cbiAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdncHMtZW50aXR5LXBsYWNlLWFkZGVkJywgeyBkZXRhaWw6IHsgY29tcG9uZW50OiB0aGlzLmVsIH0gfSkpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogSGlkZSBlbnRpdHkgYWNjb3JkaW5nIHRvIG1pbkRpc3RhbmNlIHByb3BlcnR5XG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgaGlkZUZvck1pbkRpc3RhbmNlOiBmdW5jdGlvbihlbCwgaGlkZUVudGl0eSkge1xuICAgICAgICBpZiAoaGlkZUVudGl0eSkge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCd2aXNpYmxlJywgJ2ZhbHNlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3Zpc2libGUnLCAndHJ1ZScpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBVcGRhdGUgcGxhY2UgcG9zaXRpb25cbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cblxuICAgIC8vIHNldCBwb3NpdGlvbiB0byB3b3JsZCBjb29yZHMgdXNpbmcgdGhlIGxhdC9sb24gXG4gICAgX3VwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHdvcmxkUG9zID0gdGhpcy5fY2FtZXJhR3BzLmxhdExvblRvV29ybGQodGhpcy5kYXRhLmxhdGl0dWRlLCB0aGlzLmRhdGEubG9uZ2l0dWRlKTtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJyk7XG5cbiAgICAgICAgLy8gdXBkYXRlIGVsZW1lbnQncyBwb3NpdGlvbiBpbiAzRCB3b3JsZFxuICAgICAgICAvL3RoaXMuZWwuc2V0QXR0cmlidXRlKCdwb3NpdGlvbicsIHBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywge1xuICAgICAgICAgICAgeDogd29ybGRQb3NbMF0sXG4gICAgICAgICAgICB5OiBwb3NpdGlvbi55LCBcbiAgICAgICAgICAgIHo6IHdvcmxkUG9zWzFdXG4gICAgICAgIH0pOyBcbiAgICB9LFxufSk7XG5cbi8qKlxuICogRm9ybWF0IGRpc3RhbmNlcyBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZGlzdGFuY2VcbiAqL1xuZnVuY3Rpb24gZm9ybWF0RGlzdGFuY2UoZGlzdGFuY2UpIHtcbiAgICBkaXN0YW5jZSA9IGRpc3RhbmNlLnRvRml4ZWQoMCk7XG5cbiAgICBpZiAoZGlzdGFuY2UgPj0gMTAwMCkge1xuICAgICAgICByZXR1cm4gKGRpc3RhbmNlIC8gMTAwMCkgKyAnIGtpbG9tZXRlcnMnO1xuICAgIH1cblxuICAgIHJldHVybiBkaXN0YW5jZSArICcgbWV0ZXJzJztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYWZyYW1lX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9hcmpzLWxvb2stY29udHJvbHMnXG5pbXBvcnQgJy4vYXJqcy13ZWJjYW0tdGV4dHVyZSdcbmltcG9ydCAnLi9BcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scydcbmltcG9ydCAnLi9ncHMtY2FtZXJhJ1xuaW1wb3J0ICcuL2dwcy1lbnRpdHktcGxhY2UnXG5pbXBvcnQgJy4vZ3BzLXByb2plY3RlZC1jYW1lcmEnXG5pbXBvcnQgJy4vZ3BzLXByb2plY3RlZC1lbnRpdHktcGxhY2UnXG4iXSwic291cmNlUm9vdCI6IiJ9