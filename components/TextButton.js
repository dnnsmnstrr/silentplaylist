import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
const TextButton = ({title, children, style, textStyle, onPress}) => (
  <TouchableOpacity onPress={onPress} style={{ justifyContent: 'center', alignItems: 'center', ...style }}>
    {title &&
     <Text style={{ fontSize: title.length === 1 ? 40 : 20, color: 'green', paddingHorizontal: 10, marginTop: title.length === 1 ? -8 : -2, ...textStyle}}>
       {title}
     </Text>}
    {children}
  </TouchableOpacity>
)

export default TextButton
