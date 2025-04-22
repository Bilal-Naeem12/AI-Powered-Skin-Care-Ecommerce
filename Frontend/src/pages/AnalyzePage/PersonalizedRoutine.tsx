
import React from "react";
import Button from "../../component/UI/Button";

const PersonalizedRoutine = () => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-bold mb-2">Your Personalized Routine</h3>
      <p className="text-sm text-gray-600 mb-4">
        Bespoke to your skin and your needs, your personal routine has been
        created to support your current breakout type and activity level.
      </p>
      <Button variant="secondary" className=" px-4 py-2" >
      ADD TO CART ALL
        </Button>
 
    </div>
  );
};

export default PersonalizedRoutine;
