import parse5 from 'parse5';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Linking,
} from 'react-native';

import React, {Component} from 'react';

import {
  BLOCK_ELEMENTS,
  INLINE_ELEMENTS,
  DEFAULT_STYLES,
} from './constants';

function isHyperlink(tagName) : Boolean {
  return tagName === 'a'
}

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

  if(isHyperlink(nodeName)){
    const key = `${parentKey}_text`
    const href = node.attrs[0];
    return (
      <Text key={key}
        style={[props.style, styleForTag(nodeName)]}
        onPress={()=>{
          Linking.canOpenURL(href.value)
          .then(supported => {
            if (!supported) {
              console.warn('Can\'t handle url: ' + href.value);
            } else {
              return Linking.openURL(href.value);
            }
          }).catch(err => console.error('An error occurred', err));
        }}>
        {href.value}
      </Text>
    )
  }

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
