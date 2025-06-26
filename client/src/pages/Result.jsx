import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const { generateImage } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (input) {
      //console.log("Input = ", input);
      const imageUrl = await generateImage(input);
      if (imageUrl) {
        setIsImageLoaded(true);
        setImage(imageUrl);
      }
    }

    setLoading(false);
  };

    const handleGenerateAnother = () => {
    setIsImageLoaded(false);
    setInput(""); // Clear the input field
    setImage(assets.sample_img_1); // Reset to sample image
  };

  return (
    <motion.form
      action=""
      className="flex flex-col min-h-[90vh] justify-center items-center"
      onSubmit={onSubmitHandler}
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div>
        <div className="relative">
          <img
            src={image}
            alt=""
            className="max-w-sm rounded"
            onError={(e) => {
              //console.log("Image load error:", e);
              
              if (image !== assets.sample_img_1) {
                setImage(assets.sample_img_1);
                setIsImageLoaded(false);
              }
            }}
          />
          <span
            className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${
              loading ? "w-full transition-all duration-[10s]" : "w-0"
            }`}
          ></span>
        </div>

        <p className={!loading ? "hidden" : ""}>Loading...</p>
      </div>

      {!isImageLoaded && (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
          <input
            type="text"
            placeholder="Describe what you want to generate today"
            className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholer-color pr-1.5"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <button
            type="submit"
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full text-white"
            disabled={loading || !input.trim()}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      )}

      {isImageLoaded && (
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
          <p
            className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
            onClick={handleGenerateAnother}
          >
            Generate Another
          </p>
          <a
            href={image}
            download ="generated-image.png"
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  );
};

export default Result;
