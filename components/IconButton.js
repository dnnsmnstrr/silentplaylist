import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { Ionicons, FontAwesome, AntDesign, MaterialIcons, Octicons } from '@expo/vector-icons';
import useColors from '../hooks/useColors'
const families = {
  ionic: Ionicons,
  fa: FontAwesome,
  ant: AntDesign,
  material: MaterialIcons,
  octo: Octicons
}
const IconButton = ({name = 'error', family = 'material', size = 32, title, color, style, textStyle, onPress}) => {
  const Icon = families[family]
  const colors = useColors()
  return (
    <TouchableOpacity onPress={onPress} style={{ justifyContent: 'center', alignItems: 'center', ...style }}>
      <Icon name={name} color={color || '#fff'} size={size} />
      {title &&
       <Text style={{ fontSize: title.length === 1 ? 40 : 20, color: colors.text, paddingHorizontal: 10, marginTop: title.length === 1 ? -8 : -2, ...textStyle}}>
         {title}
       </Text>}
    </TouchableOpacity>
  )
}

export default IconButton
