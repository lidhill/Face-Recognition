import React from "react";

const FaceRecognition = ({ IMAGE_URL }) => {
  return (
   <div className='center'>
    <img alt='' src={IMAGE_URL} />
   </div>
  );
}

export default FaceRecognition;