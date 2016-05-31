import parse5 from 'parse5';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import React, {Component} from 'react';

const BLOCK_ELEMENTS = ["blockquote", "div", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "ol", "p", "pre", "ul", "li"]

const INLINE_ELEMENTS = ["b", "i", "em", "strong", "a", "br", "q", "span", "sub", "sup", "u"]

const DEFAULT_STYLES = StyleSheet.create({
  a: {

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

function isText(tagName) : Boolean {
  return tagName === "#text"
}

function isBlockElement(tagName) : Boolean {
  return BLOCK_ELEMENTS.indexOf(tagName) != -1
}

function isInlineElement(tagName) : Boolean {
  return INLINE_ELEMENTS.indexOf(tagName) != -1
}

function styleForTag(tagName) {
  const style = DEFAULT_STYLES[tagName] ? DEFAULT_STYLES[tagName] : DEFAULT_STYLES["default"]
  return style
}

function processNode(node, parentKey, props) {
  const nodeName = node.nodeName;
  
  if (isText(nodeName)) {
    const key = `${parentKey}_text`
    return (<Text key={key} style={props.style}>{node.value}</Text>)
  }

  if (isInlineElement(nodeName)) {
    const key = `${parentKey}_${nodeName}`
    var children = []
    node.childNodes.forEach((child, index) => {
      if (isInlineElement(child.nodeName) || isText(child.nodeName)) {
        children.push(processNode(child, `${key}_${index}`, props))
      } else {
        console.error(`Inline element ${nodeName} can only have inline children, ${child} is invalid!`)
      }
    })
    return (
      <Text 
        key={key} 
        style={[styleForTag(nodeName), props.style]}>
        {children}
      </Text>
    )
  }

  if (isBlockElement(nodeName)) {
    const key = `${parentKey}_${nodeName}`
    var children = []
    var lastInlineNodes = []

    node.childNodes.forEach((childNode, index) => {
      var child = processNode(childNode, `${key}_${index}`, props)
      if (isInlineElement(childNode.nodeName) || isText(childNode.nodeName)) {
        lastInlineNodes.push(child)

      } else if (isBlockElement(childNode.nodeName)) {
        if (lastInlineNodes.length > 0) {
          children.push(
            <Text 
              key={`${key}_${index}_inline`} 
              style={[styleForTag(nodeName), props.style]}>{lastInlineNodes}
            </Text>)
          lastInlineNodes = []
        }
        children.push(child)
      }
    })

    if (lastInlineNodes.length > 0) {
      children.push((<Text key={`${key}_last_inline`} style={[styleForTag(nodeName), props.style]}>{lastInlineNodes}</Text>))
    }
    return (
      <View key={key}>
        {children}
      </View>
    )
  }

  console.warn(`unsupported node: ${nodeName}`)
  return null;
}

export default class HtmlText extends Component {
  parse(html) {
    var parser = new parse5.Parser()
    var fragment = parser.parseFragment(html)
    return fragment
  }


  render() {
    var html = this.props.html
    var fragment = this.parse(html)
    var rootKey = "ht_"

    var children = []
    fragment.childNodes.forEach((node, index) => {
      children.push(processNode(node, `${rootKey}_${index}`, this.props))
    })
    
    return (
      <View style={this.props.containerStyle}>
        {children}
      </View>
    )
  }
}
