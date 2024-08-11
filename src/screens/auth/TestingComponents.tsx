import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import GravityComponent from '../../components/GravityComponent'

const TestingComponents = () => {
  return (
    <View style={{ flex: 1 }}>
      <GravityComponent />
    </View>
  )
}

export default TestingComponents

const styles = StyleSheet.create({})