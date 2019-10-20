import styled from "styled-components";
import {
  typography,
  color,
  space,
  flexbox,
  layout,
  ColorProps,
  SpaceProps,
  FlexboxProps,
  LayoutProps,
  TypographyProps
} from "styled-system";

export type TextProps = TypographyProps &
  ColorProps &
  SpaceProps &
  FlexboxProps &
  LayoutProps;

const Text = styled.div<TextProps>`
  ${typography}
  ${color}
  ${space}
  ${flexbox}
  ${layout}
`;

export default Text;
