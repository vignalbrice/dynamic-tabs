import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Animated, StyleSheet, Image, View, Dimensions, Text, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window')

const images = {
  man:
    'https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  women:
    'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  kids:
    'https://images.pexels.com/photos/5080167/pexels-photo-5080167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  skullcandy:
    'https://images.pexels.com/photos/5602879/pexels-photo-5602879.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  help:
    'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
};
const data = Object.keys(images).map((i) => ({
  key: i,
  title: i,
  image: images[i],
  ref: React.createRef()
}));

export default function App() {
  /** current ScrollX value animated */
  const scrollX = React.useRef(new Animated.Value(0)).current;
  /** Reference of flatlist */
  const ref = React.useRef();
  /** onItemPress function to scroll into view */
  const onItemPress = React.useCallback(itemIndex => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * width
    })
  })
  /** Indicator component */
  const Indicator = ({ measures, scrollX }) => {
    const inputRange = data.map((_, i) => i * width);
    /**Set the indicator with at scroll event */
    const indicatorWidth = scrollX.interpolate({
      inputRange,
      outputRange: measures.map((measure) => measure.width)
    })
    /**Modify the indicator at the scroll event */
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: measures.map((measure) => measure.x)
    })
    return <Animated.View style={{ position: 'absolute', height: 4, width: indicatorWidth, backgroundColor: "white", bottom: -10, transform: [{ translateX }] }} />
  }
  /** Tab component for each tabs */
  const Tab = React.forwardRef(({ item, onItemPress }, ref) => {
    return <TouchableOpacity onPress={onItemPress}>
      <View ref={ref}>
        <Text style={{ color: 'white', fontSize: 84 / data.length, fontWeight: 'bold', textTransform: 'uppercase' }}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  });
  /** Tabs component from flatlist */
  const Tabs = ({ data, scrollX, onItemPress }) => {
    const containerRef = React.useRef();
    const [measures, setMeasures] = React.useState([]);
    React.useEffect(() => {
      const m = [];
      data.forEach(item => {
        /** measure layout of each title by reference */
        item.ref.current.measureLayout(containerRef.current, (x, y, width, height) => {
          /** push it into an array, with xPosition, yPosition, width and height */
          m.push({ x, y, width, height });
          /** if array is totally populate and have the same width from data set measures */
          if (m.length === data.length) setMeasures(m);
        })
      })
    })
    return <View style={{ position: 'absolute', top: width / 5, width }}>
      <View style={{ justifyContent: 'space-evenly', flex: 1, flexDirection: 'row' }} ref={containerRef}>
        {data.map((item, index) => <Tab key={item.key} item={item} ref={item.ref} onItemPress={() => onItemPress(index)} />)}
      </View>
      {measures.length > 0 && <Indicator measures={measures} scrollX={scrollX} />}
    </View>
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
        ref={ref}
        data={data}
        keyExtractor={item => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image source={{ uri: item.image }}
                style={{ flex: 1, resizeMode: 'cover' }}
              />
              <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
            </View>
          );
        }} />
      <Tabs scrollX={scrollX} data={data} onItemPress={onItemPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});