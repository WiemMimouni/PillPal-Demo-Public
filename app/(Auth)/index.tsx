import React, { useRef, useState } from 'react'
import { Animated, Dimensions, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import OnBoardingItem from 'components/OnBoarding/OnBoardingItem'
import { hp } from '@/constants/ScreenSize'
import { useRouter } from 'expo-router'

const OnBoarding = () => {
  const scrollX = useRef(new Animated.Value(0)).current
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const slidesRef = useRef(null)
  const router = useRouter()
  
  const slides = [
    {
      id: 1,
      title: "Remind your own needs",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam maecenas mi non sed ut odio. Non, justo, sed facilisi et",
      image: require("@/assets/images/slide1.png")
    },
    {
      id: 2,
      title: "Track your own treatments",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam maecenas mi non sed ut odio. Non, justo, sed facilisi et",
      image: require("@/assets/images/slide2.png")
    },
    {
      id: 3,
      title: "Customize your wellness with personalized reminder",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam maecenas mi non sed ut odio. Non, justo, sed facilisi et",
      image: require("@/assets/images/slide3.png")
    }
  ]

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index)
    }
  }).current

  const Pagination = () => {
    return (
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={({ item }) => <OnBoardingItem title={item.title} description={item.description} image={item.image} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={16}
        snapToAlignment="center"
        snapToInterval={Dimensions.get("window").width}
        decelerationRate="fast"
      />
      <Pagination />
      {currentIndex === 2 && <TouchableOpacity onPress={() => router.push({ pathname: "login"})} style={styles.signInButton}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#31E3B9",
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 130,
    alignSelf: "center",
    marginTop: 20,
    zIndex: 10000000000000
  },
  paginationDot: {
    height: hp("1.5%"),
    width: hp("1.5%"),
    borderRadius: hp("0.75%"),
    marginHorizontal: 10,
  },
  activeDot: {
    backgroundColor: "#2F6B47",
  },
  inactiveDot: {
    backgroundColor: "white",
  },
  signInButton: {
    height: 50,
    backgroundColor: "white",
    marginBottom: 50,
    width: 130,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signInText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "semibold"
  }
})

export default OnBoarding
