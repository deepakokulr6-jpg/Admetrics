/** Jest stand-in for the native sheet library (ESM, native views). */
const React = require('react');

const Passthrough = ({ children }) =>
  React.createElement(React.Fragment, null, children);

module.exports = {
  BottomSheetProvider: Passthrough,
  // Render content only while open, like the real lazy sheet.
  ModalBottomSheet: ({ index, children }) =>
    index > 0 ? React.createElement(React.Fragment, null, children) : null,
  BottomSheet: Passthrough,
};
