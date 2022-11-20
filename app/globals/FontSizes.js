import { wp } from "./helper/Responsive";

const FontSizes = {
  Size12: wp(12) < 12 ? 12 : wp(12),
  Size13: wp(13) < 13 ? 13 : wp(13),
  Size14: wp(14) < 14 ? 14 : wp(14),
  Size15: wp(15) < 15 ? 15 : wp(15),
  Size16: wp(16) < 16 ? 16 : wp(16),
  Size17: wp(17) < 17 ? 17 : wp(17),
  Size18: wp(18) < 18 ? 18 : wp(18),
};

export { FontSizes };
