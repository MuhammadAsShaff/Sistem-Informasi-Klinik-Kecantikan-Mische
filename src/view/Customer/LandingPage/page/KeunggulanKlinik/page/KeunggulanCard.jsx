import React from 'react';

/**
 * =========================================================================
 * PIAGAM MEDALI KEUNGGULAN (KeunggulanCard)
 * =========================================================================
 * Ibarat plakat kaca beralas beludru yang memajang satu lambang medali (icon),
 * judul kebanggaan, dan tulisan penjelas mengenai standar tinggi klinik Mische.
 */
const KeunggulanCard = ({ item }) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-start group">
      <div className="shrink-0 mb-1 md:mb-0 scale-75 md:scale-100 origin-left">
        {item.icon}
      </div>
      <div>
        <h3 className="text-[#000000] text-lg md:text-2xl font-bold mb-1 md:mb-2 leading-tight">
          {item.title}
        </h3>
        <p className="text-gray-500 text-[10px] md:text-lg font-regular opacity-80">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default KeunggulanCard;
