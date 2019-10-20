import styled from "styled-components";
import {
  color,
  space,
  flexbox,
  layout,
  ColorProps,
  SpaceProps,
  FlexboxProps,
  LayoutProps
} from "styled-system";

export type BoxProps = ColorProps & SpaceProps & FlexboxProps & LayoutProps;

const Box = styled.div<BoxProps>`
  ${color}
  ${space}
  ${flexbox}
  ${layout}
`;

export default Box;
