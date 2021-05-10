import React,{ useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import {useConverstions} from '../contexts/ConversationsProvider';

const Item = ({title}) => (
  <Pressable
    style={styles.conversationContent}
    onPress={() => {
      // navigation.navigate('openchat');
    }}>
    <View style={styles.conversationLeftContent}>
      <Image
        style={styles.image}
        source={{uri: 'https://picsum.photos/100/100'}}
      />
      <View style={{marginLeft: 10}}>
        <Text>{title}</Text>
        <Text>conversation last message</Text>
      </View>
    </View>
    <Text>time</Text>
  </Pressable>
);

export default function ConversationScreen({navigation}) {
  const {conversations} = useConverstions();

  console.log('conversations: ',conversations);

  const [dataSource, setDataSource] = useState([
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ])
  const renderItem = ({item}) => <Item title={item.title} />;
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Pressable style={styles.search}>
          <TextInput style={styles.textInput} placeholder="liên hê, nhóm" />
        </Pressable>
        <Pressable style={styles.filter}></Pressable>
      </View>
      <View style={styles.conversationContainer}>
      <FlatList
        data={dataSource}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  searchContainer: {
    height: 40,
    // paddingVertical:3,
  },
  search: {
    flex: 0.8,
    paddingLeft: 5,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  filter: {
    flex: 0.2,
  },
  textInput: {
    marginLeft: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  conversationContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#fafafa',
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EBF0F9',
  },
  conversationLeftContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
