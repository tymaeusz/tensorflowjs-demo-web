import styles from "../../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import { createDetector, SupportedModels } from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import { drawHands } from "../../lib/utils";
import { drawKeypoints3D } from "../../lib/utils";
import Link from "next/link";
import { useAnimationFrame } from "../../lib/hooks/useAnimationFrame";
import * as scatter from "scatter-gl";
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";
import FpsCounter from "../../components/FpsCounter";

// Set the WASM paths for TensorFlow.js backend
tfjsWasm.setWasmPaths(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`);

// Function to initialize the video stream
async function setupVideo(deviceId) {
  const video = document.getElementById("video");

  // Request access to the selected video device
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { deviceId },
  });

  video.srcObject = stream;

  await new Promise((resolve) => {
    video.onloadedmetadata = resolve;
  });

  video.play();
  console.log("Video initialized:", video.videoWidth, video.videoHeight);

  while (!video.videoWidth || !video.videoHeight) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  video.width = video.videoWidth;
  video.height = video.videoHeight;

  return video;
}

// Function to initialize the hand pose detection model
async function setupDetector() {
  const model = SupportedModels.MediaPipeHands;
  const detector = await createDetector(model, {
    runtime: "mediapipe",
    maxHands: 2,
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
  });

  return detector;
}

// Function to initialize the canvas for 2D rendering
async function setupCanvas(video) {
  const canvas = document.getElementById("canvas"); // Ensure this ID matches your HTML
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions to match the video dimensions
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  return ctx;
}

export default function HandPoseDetection() {
  const detectorRef = useRef();
  const videoRef = useRef();
  const scatterGLRef = useRef();
  const scatterContainerRef = useRef();
  const [ctx, setCtx] = useState();
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Get available video devices
  useEffect(() => {
    async function fetchDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setVideoDevices(videoDevices);
    }
    fetchDevices();
  }, []);

  // Initialize video, canvas, and detector when component mounts or device is selected
  useEffect(() => {
    if (!selectedDevice) return;

    async function initialize() {
      videoRef.current = await setupVideo(selectedDevice.deviceId);
      if (!videoRef.current) return;

      const ctx = await setupCanvas(videoRef.current);
      detectorRef.current = await setupDetector();

      // Initialize scatter-gl for 3D hand pose visualization with interactivity
      scatterGLRef.current = new scatter.ScatterGL(scatterContainerRef.current, {
        rotateOnStart: true,
        selectEnabled: false,
        styles: {
          polyline: { defaultOpacity: 1, deselectedOpacity: 1 },
          points: { default: { color: "rgb(0, 0, 139)" } }, // Dark blue color (RGB)
        },
        interactionEnabled: true, // Enable interaction (rotate, zoom, pan)
      });

      setCtx(ctx); // Store the 2D canvas context
    }

    initialize();
  }, [selectedDevice]);

  // In your animation frame or update function, you will now generate paths
  useAnimationFrame(async (delta) => {
    if (!detectorRef.current || !videoRef.current || !ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Ensure video is ready and draw the video frame onto the canvas
    if (videoRef.current.readyState >= 2) {
      ctx.drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight
      );
    } else {
      console.warn("Video not ready");
    }

    // Estimate hand poses
    const hands = await detectorRef.current.estimateHands(videoRef.current, {
      flipHorizontal: false,
    });

    // Draw hand keypoints on the 2D canvas
    if (hands.length > 0) {
      drawHands(hands, ctx);
    }

    // Update the 3D scatter-gl visualization
    if (hands.length > 0 && scatterGLRef.current) {
      const handedness = hands[0].handedness; // Left or Right hand
      const keypoints3D = hands[0].keypoints3D.map(({ x, y, z }) => ({ x, y, z }));

      // Prepare connections between keypoints
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [0, 5], [5, 6], [6, 7], [7, 8],
        [0, 9], [9, 10], [10, 11], [11, 12],
        [0, 13], [13, 14], [14, 15], [15, 16],
        [0, 17], [17, 18], [18, 19], [19, 20],
      ];

      drawKeypoints3D(keypoints3D, handedness, {
        scatterGL: scatterGLRef.current,
        scatterGLHasInitialized: scatterGLRef.currentHasInitialized,
      }, connections, scatter);

      scatterGLRef.currentHasInitialized = true;
    }
  }, !!(detectorRef.current && videoRef.current && ctx));

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h2 style={{ fontWeight: "normal" }}>
          <Link style={{ fontWeight: "bold" }} href={"/"}>Início</Link> / Detector de Mão 👋
        </h2>

        <FpsCounter />

        <div style={{ marginBottom: "20px" }}>
          {/* Dropdown for selecting the device */}
          <label htmlFor="device-select"  style={{
            fontWeight: "bold",
            textAlign: "center",  // Align text to the center
            display: "block",     // Make the label a block element so it takes up the full width
            width: "100%",        // Ensure the label spans the full width of its container
          }}>
            Selecione uma Webcam: 
          </label>
          <br/>
          <select
            id="device-select"
            onChange={(e) => {
              const selectedDevice = videoDevices.find(
                (device) => device.deviceId === e.target.value
              );
              setSelectedDevice(selectedDevice);
            }}
            value={selectedDevice?.deviceId || ""}
            style={{
              width: "100%",
              borderRadius: "5px",
              padding: "8px",
              marginBottom: "20px",
              fontWeight: "bold",
              outline: "none",
              border: "1px solid #ccc",
              transition: "background-color 0.3s ease",
            }}
            disabled={!!selectedDevice}  // Disable the selector after device selection
          >
            <option value="" disabled>
              Select a device
            </option>
            {videoDevices.map((device) => (
              <option
                key={device.deviceId}
                value={device.deviceId}
                style={{
                  padding: "10px",
                  backgroundColor: selectedDevice?.deviceId === device.deviceId ? "#d0e7ff" : "white", // blue hue on selected
                }}
              >
                {device.label || `Unnamed device`}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* 2D Hand Pose Tracking */}
          <div style={{ flex: 1 }}>
            <canvas
              style={{
                transform: "scaleX(-1)", // Flip horizontally for the mirror effect
                zIndex: 1,
                borderRadius: "1rem",
                boxShadow: "0 3px 10px rgb(0 0 0)",
                width: "100%", // Make the canvas responsive
                height: "100%",
              }}
              id="canvas"
            ></canvas>
            <video
              style={{
                visibility: "hidden",
                transform: "scaleX(-1)", // Flip horizontally to match canvas
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%", // Make video responsive
                height: "100%",
              }}
              id="video"
              playsInline
            ></video>
          </div>

          {/* 3D Hand Pose Tracking */}
          <div style={{ flex: 1 }}>
            <div
              ref={scatterContainerRef}
              style={{
                width: "100%", // Make the container take full width
                height: "100%", // Make the container take full height
                borderRadius: "1rem",
                boxShadow: "0 3px 10px rgb(0 0 0)",
                background: "#fff",
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
