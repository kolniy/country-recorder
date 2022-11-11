const { useState, useEffect } = require("react");

module.exports = ({ isOpen, children }) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <>
      {open === true && (
        <div className="w-full h-full left-0 top-0 bg-black/50 fixed flex flex-col justify-center items-center">
          {children}
        </div>
      )}
    </>
  );
};
