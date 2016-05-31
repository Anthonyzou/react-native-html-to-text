
import {
  StyleSheet,
} from 'react-native';

export const BLOCK_ELEMENTS = ["blockquote", "div", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "ol", "p", "pre", "ul", "li"]
export const INLINE_ELEMENTS = ["b", "i", "em", "strong", "a", "br", "q", "span", "sub", "sup", "u"]
export const DEFAULT_STYLES = StyleSheet.create({
  a: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    color: "blue",
  },
  b: {
    fontWeight: 'bold'
  },
  blockquote: {
    paddingLeft: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#cccccc',
    marginBottom: 12
  },
  br: {

  },
  div: {

  },
  em: {
    fontStyle: 'italic'
  },
  h1: {
    fontSize:15,
    fontWeight: 'bold',
  },
  h2: {
    fontSize:14,
    fontWeight: 'bold',
  },
  h3: {
    fontSize:13,
    fontWeight: 'bold',
  },
  h4: {
    fontSize:12,
    fontWeight: 'bold',
  },
  h5: {
    fontSize:11,
    fontWeight: 'bold',
  },
  h6: {
    fontSize:10,
    fontWeight: 'bold',
  },
  i: {
    fontStyle: 'italic'
  },
  p: {
    marginBottom: 12,
  },
  pre: {

  },
  strong: {
    fontWeight: 'bold'
  },
  q: {

  },
  span: {

  },
  sub: {

  },
  sup: {

  },
  ol:{
    marginLeft: 24,
  },
  ul: {
    marginLeft: 24,
  },
  u:{
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid'
  },
  default: {

  }
});
