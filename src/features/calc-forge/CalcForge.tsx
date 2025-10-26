// import { useState } from 'react';
import './calculatorLogic';
// import { getAllTools, runTool } from './calc-tool';
import CalcForgeDesktop from './CalcForgeDesktop';
import CalcForgeMobile from './CalcForgeMobile';

// MENU UI E 11/12 KOYOK IKI AE.
// +------------------------------------------------------+
// |  CalcForge                                           |
// |------------------------------------------------------|
// | [Mode: Basic | Scientific | Custom | History ]       |
// |------------------------------------------------------|
// | [Input Field / Expression Editor]                    |
// |------------------------------------------------------|
// | [Result Display]                                     |
// |------------------------------------------------------|
// | [Keypad / Function Panel]                            |
// |------------------------------------------------------|
// | [Optional: History / Variables / Functions Panel]    |
// +------------------------------------------------------+
//
// Input Area
//
// A multiline expression editor (supports variables, functions, parentheses).
// MAYBE: Syntax highlighting (show functions like sin(), log(), volume() in color).

// Result Area
//
// Shows evaluated results in real-time.
// Supports units display (ex: m³, m/s).
// Option to copy result or pin it.

// Keypad / Function Panel
//
// Modular panels (show/hide categories):
//  Basic: 0–9, +, −, ×, ÷, =, AC
//  Scientific: sin, cos, tan, log, exp, π, e
//  Custom / Physics / Geometry:
// Example: Volume of Box, Speed, etc.
//  User Functions: dynamically loaded from code (hitungVolumeBalok).
//
// Side Drawer / History
//
// List of past calculations.
// Option to re-run or edit.
// Saved variables (like a = 5, b = 10).

// Optional
//
// Equation Parser / Symbolic Input: Users can type expressions like volume(2,3,4) directly.
// Units System: Automatic unit conversion and consistency checks.

// Nanti saya beri metadata seperti ini, untuk membuat logic lebih mudah di tambahkan.
// {
//   id: "volume_box",
//   name: "Volume of Box",
//   params: [
//     { name: "Length", unit: "m" },
//     { name: "Width", unit: "m" },
//     { name: "Height", unit: "m" },
//   ],
//   execute: hitungVolumeBalok
// }
// Nanti UI bisa langsung membuat input dari metadata-nya.

// Example UI Flow
//
// User wants to compute box volume:
// Switch to “Geometry” panel.
// Select “Volume of Box”.
// Input values for length, width, height.
// See instant result: Volume = 2.4 m³.
// Optionally save it as myBoxVolume.

export default function CalcForge() {
  return (
    <CalcForgeMobile />
  )
}
