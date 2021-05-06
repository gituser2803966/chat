import React from 'react';
import {View, Text, Image, StyleSheet, TextInput, Pressable} from 'react-native';

export default function ConversationScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Pressable style={styles.search}>
          
          <TextInput
            style={styles.textInput}
            placeholder="liên hê, nhóm"
          />
        </Pressable>
        <Pressable style={styles.filter} >
        </Pressable>
      </View>
      <View
        style={styles.conversationContainer}>
        <Pressable
          style={styles.conversationContent}
          onPress={()=>{navigation.navigate("openchat")}}
        >
          <View style={styles.conversationLeftContent}>
            <Image
              style={styles.image}
              source={{ uri:"https://picsum.photos/100/100" }}
            />
            <View style={{ marginLeft:10, }}>
              <Text>
                conversation group name
              </Text>
              <Text>
                conversation last message
              </Text>
            </View>
          </View>
          <Text>time</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingVertical:5,
    paddingHorizontal:5,
  },
  searchContainer:{
    height:40,
    // paddingVertical:3,
  },
  search:{
    flex:0.8,
    paddingLeft:5,
    display:"flex",
    flexDirection:'row',
    borderRadius:10,
    alignItems:"center",
    backgroundColor: '#fafafa',
  },
  filter:{
    flex:0.2,
  },
  textInput:{
    marginLeft:5,
  },
  image:{
    width:50,
    height:50,
    borderRadius:50,
  },
  conversationContent:{
    display:'flex',
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingVertical:5,
    backgroundColor: '#fafafa',
    paddingHorizontal:10,
    borderBottomWidth:0.5,
    borderBottomColor:"#EBF0F9",
  },
  conversationLeftContent:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
  },
})