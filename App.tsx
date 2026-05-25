import React, { useState } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import BookingsScreen from './screens/BookingsScreen';

type PreviewRoute = 'Login' | 'Home' | 'AllRestaurants' | 'Restaurant' | 'Events' | 'Deals' | 'Bookings' | 'Profile';

const restaurants = [
  ['The Rooftop Kitchen', 'Westlands · Grill & Bar · KES 800-1,200'],
  ["Mama's Kitchen", 'Karen · Local cuisine · KES 1,000-1,500'],
  ['Kilimani Brunch Club', 'Kilimani · Brunch · KES 1,200-2,000'],
];

const HEADER_TOP_PADDING = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 14 : 56;

const buildRollingDates = (count = 21) => {
  const today = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return {
      key: date.toISOString(),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      num: String(date.getDate()),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      active: index === 0,
      dot: [0, 2, 5, 8, 13, 17].includes(index),
      date,
    };
  });
};

const buildMonthGrid = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ key: string; label: string; date?: Date; disabled?: boolean; blank?: boolean }> = [];

  for (let i = 0; i < firstDay; i += 1) {
    cells.push({ key: `blank-${i}`, label: '', blank: true });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    cells.push({ key: date.toISOString(), label: String(day), date, disabled: isPast });
  }

  return cells;
};


export default function App() {
  const [route, setRoute] = useState<PreviewRoute>('Login');
  const [email, setEmail] = useState('');
  const [savedRestaurants, setSavedRestaurants] = useState<string[]>([]);

  const toggleSavedRestaurant = (restaurantName: string) => {
    setSavedRestaurants((current) =>
      current.includes(restaurantName)
        ? current.filter((name) => name !== restaurantName)
        : [...current, restaurantName]
    );
  };

  const navigation = {
    navigate: (nextRoute: PreviewRoute) => setRoute(nextRoute || 'Home'),
    goBack: () => setRoute('Home'),
    toggleSavedRestaurant,
    savedRestaurants,
  };

  if (route === 'Login') {
    return <LoginPreview email={email} setEmail={setEmail} onLogin={() => setRoute('Home')} />;
  }

  if (route === 'Home') return <HomeScreen navigation={navigation} />;
  if (route === 'Events') return <EventsPreview navigation={navigation} />;
  if (route === 'Restaurant') return <RestaurantPreview navigation={navigation} />;
  if (route === 'Bookings') return <ReservationPreview navigation={navigation} />;
  if (route === 'Deals') return <DealsPreview navigation={navigation} />;
  if (route === 'AllRestaurants') return <DiscoverPreview navigation={navigation} />;
  if (route === 'Profile') return <ProfilePreview navigation={navigation} email={email} savedRestaurants={savedRestaurants} />;

  return <HomeScreen navigation={navigation} />;
}

const LoginPreview = ({ email, setEmail, onLogin }: any) => (
  <View style={styles.shell}>
    <View style={styles.logoWrap}>
      <View style={styles.logoIcon}>
        <View style={styles.steamRow}><View style={styles.steamDot} /><View style={[styles.steamDot, styles.steamDotTall]} /><View style={styles.steamDot} /></View>
        <View style={styles.bowlRim} />
        <View style={styles.bowlBody}><View style={styles.kesTag}><Text style={styles.kesText}>KES</Text></View></View>
      </View>
      <Text style={styles.logoWord}>Cravy</Text>
      <Text style={styles.logoTagline}>NAIROBI FOOD DISCOVERY</Text>
    </View>
    <Text style={styles.title}>Eat, reserve, and discover Nairobi.</Text>
    <Text style={styles.subtitle}>Sign in to continue to cravyapp.</Text>
    <View style={styles.card}>
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" placeholderTextColor="#A9A9A9" />
      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} secureTextEntry placeholder="Password" placeholderTextColor="#A9A9A9" />
      <TouchableOpacity style={styles.button} onPress={onLogin}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
    </View>
  </View>
);

const PreviewHeader = ({ title, subtitle, navigation }: any) => (
  <View style={styles.previewHeader}>
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}><Ionicons name="arrow-back" size={20} color="#FFFFFF" /></TouchableOpacity>
    <View style={{ flex: 1 }}><Text style={styles.previewTitle}>{title}</Text><Text style={styles.previewSubtitle}>{subtitle}</Text></View>
  </View>
);

const DiscoverPreview = ({ navigation }: any) => (
  <View style={styles.previewShell}>
    <PreviewHeader title="Discover" subtitle="Restaurants near you" navigation={navigation} />
    <ScrollView contentContainerStyle={styles.previewContent}>{restaurants.map(([name, meta]) => <TouchableOpacity key={name} style={styles.listCard} onPress={() => navigation.navigate('Restaurant')}><View style={styles.imageBlock}><Ionicons name="business" size={34} color="#C4A882" /></View><View style={styles.restaurantTitleRow}><Text style={styles.cardTitle}>{name}</Text><TouchableOpacity style={styles.saveButtonSmall} onPress={() => navigation.toggleSavedRestaurant(name)}><Ionicons name={navigation.savedRestaurants.includes(name) ? 'heart' : 'heart-outline'} size={22} color="#E23744" /></TouchableOpacity></View><Text style={styles.cardMeta}>{meta}</Text><Text style={styles.redAction}>Reserve table</Text></TouchableOpacity>)}</ScrollView>
    <BottomNav active="Discover" navigation={navigation} />
  </View>
);


const RestaurantPreview = ({ navigation }: any) => (
  <View style={styles.previewShell}>
    <PreviewHeader title="The Rooftop Kitchen" subtitle="Westlands · 1.2km away" navigation={navigation} />
    <View style={styles.tabBar}><Text style={styles.tabActive}>Menu</Text><Text style={styles.tabText}>Info</Text><Text style={styles.tabText}>Reviews</Text><Text style={styles.tabText}>Deals</Text></View>
    <ScrollView contentContainerStyle={styles.previewContent}>
      <View style={styles.rowCard}><Text style={styles.menuSection}>Starters</Text>{['Grilled chicken wings · KES 450', 'Beef samosas · KES 320'].map((item) => <Text key={item} style={styles.menuLine}>{item}</Text>)}</View>
      <View style={styles.rowCard}><Text style={styles.menuSection}>Mains</Text>{['Nyama choma platter · KES 1,100', 'Tilapia fillet · KES 950'].map((item) => <Text key={item} style={styles.menuLine}>{item}</Text>)}</View>
      <View style={styles.budgetBox}><Text style={styles.budgetTitle}>Budget estimate</Text><Text style={styles.cardMeta}>Starter + main ≈ KES 1,250 / person</Text></View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bookings')}><Text style={styles.buttonText}>Reserve a table</Text></TouchableOpacity>
    </ScrollView>
  </View>
);

const EventsPreview = ({ navigation }: any) => {
  const eventDates = buildRollingDates(21);

  return (
    <View style={styles.previewShell}>
      <View style={styles.eventsHeader}>
        <View style={styles.headerTopLine}><View style={styles.headerTitleBlock}><Text style={styles.eventsTitle}>Events</Text><Text style={styles.eventsSub}>What's happening in Nairobi</Text></View><TouchableOpacity style={styles.headerBell}><Ionicons name="notifications-outline" size={18} color="#FFFFFF" /></TouchableOpacity></View>
        <View style={styles.headerSearch}><Ionicons name="search" size={18} color="#AAAAAA" /><Text style={styles.headerSearchText}>Search events...</Text><Ionicons name="options-outline" size={18} color="#AAAAAA" style={styles.searchFilterIcon} /></View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekStripRef}>{eventDates.map((item) => <TouchableOpacity key={item.key} style={[styles.weekDayRef, item.active && styles.weekDayActiveRef]}><Text style={[styles.weekLabelRef, item.active && styles.weekTextActive]}>{item.day}</Text><Text style={[styles.weekNumRef, item.active && styles.weekTextActive]}>{item.num}</Text>{item.dot ? <View style={styles.weekDotRef} /> : null}</TouchableOpacity>)}</ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dealFilters}>{['All', 'Food festival', 'Pop-up', 'Chef table', 'Tasting', 'Nightlife'].map((x, i) => <Text key={x} style={[styles.dealFilter, i === 0 && styles.dealFilterActive]}>{x}</Text>)}</ScrollView>
      <ScrollView contentContainerStyle={styles.eventsBody}>
        <TouchableOpacity style={styles.featuredEventRef} onPress={() => navigation.navigate('EventDetail')}>
          <View style={styles.feTop}><Text style={styles.feBadge}>Today · Trending</Text><Text style={styles.feTitle}>Nairobi Street Food Festival</Text><Text style={styles.feLoc}>Uhuru Gardens · 12:00 PM - 9:00 PM</Text><View style={styles.feTags}><Text style={styles.feTag}>30+ vendors</Text><Text style={styles.feTag}>Live music</Text><Text style={styles.feTag}>Family friendly</Text></View></View>
          <View style={styles.feBottom}><View><Text style={styles.fePriceLabel}>From</Text><Text style={styles.fePrice}>KES 500</Text></View><View style={styles.ticketActionRow}><Text style={styles.ticketsLeftDark}>142 tickets left</Text><Text style={styles.feButton}>Get tickets</Text></View></View>
        </TouchableOpacity>
        <View style={styles.sectionHeaderLine}><Text style={styles.refSectionTitle}>Coming up</Text><Text style={styles.seeAllRed}>See all</Text></View>
        {buildRollingDates(3).map((dateItem, index) => {
          const eventRows = [
            ['Sunday Brunch Pop-up','The Terrace, Kilimani','KES 1,200','Pop-up'],
            ["Chef's Table - Swahili cuisine",'Mama Oliech, Hurlingham','KES 3,500','8 seats left'],
            ['Wine & Cheese Evening','Skylark Bar, Westlands','KES 2,000','Tasting'],
          ];
          const [name, loc, price, type] = eventRows[index];
          return <View key={name} style={styles.eventCardRef}><View style={styles.eventDateRef}><Text style={styles.eventDayRef}>{dateItem.num}</Text><Text style={styles.eventMonthRef}>{dateItem.month}</Text></View><View style={styles.eventInfoRef}><Text style={styles.eventNameRef}>{name}</Text><Text style={styles.eventLocRef}>{loc}</Text><View style={styles.eventFooterRef}><Text style={styles.eventPriceRef}>{price}</Text><Text style={type.includes('left') ? styles.ticketsLeftRef : styles.eventTypeRef}>{type}</Text></View></View></View>;
        })}
      </ScrollView>
      <BottomNav active="Events" navigation={navigation} />
    </View>
  );
};

const DealsPreview = ({ navigation }: any) => (
  <View style={styles.previewShell}>
    <View style={styles.dealsHeader}>
      <View style={styles.headerTopLine}><View><Text style={styles.dealsTitle}>Deals & offers</Text><Text style={styles.dealsSub}>14 active deals near you</Text></View><TouchableOpacity style={styles.headerBell}><Ionicons name="notifications-outline" size={18} color="#FFFFFF" /></TouchableOpacity></View>
      <View style={styles.dealsSearch}><Ionicons name="search" size={16} color="#AAAAAA" /><Text style={styles.dealsSearchText}>Search deals...</Text></View>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dealFilters}>{['All', 'Happy hour', 'Discount', 'Free item', 'Set menu'].map((x, i) => <Text key={x} style={[styles.dealFilter, i === 0 && styles.dealFilterActive]}>{x}</Text>)}</ScrollView>
    <ScrollView contentContainerStyle={styles.previewContent}>
      <View style={styles.happyHourBand}><Ionicons name="time-outline" size={22} color="#E23744" /><View style={{ flex: 1 }}><Text style={styles.hhTitle}>Happy hour is on right now</Text><Text style={styles.hhSub}>3 restaurants near you · ends at 7:00 PM</Text></View><Text style={styles.liveBadge}>Live</Text></View>
      <Text style={styles.refSectionTitle}>Featured deal</Text>
      <View style={styles.featuredDealRef}>
        <View style={styles.featureStrip} />
        <View style={styles.featureInner}>
          <Text style={styles.featureTag}>50% off today only</Text>
          <Text style={styles.featureTitle}>2-for-1 lunch combo</Text>
          <Text style={styles.featureRest}>The Rooftop Kitchen · Westlands</Text>
          <View style={styles.featurePills}><Text style={styles.featurePill}>Burger + fries + drink</Text><Text style={styles.featurePill}>Dine-in only</Text></View>
          <View style={styles.featureFooter}><View style={styles.priceRow}><Text style={styles.priceNow}>KES 750</Text><Text style={styles.priceWas}>KES 1,500</Text></View><View style={styles.countdown}><Text style={styles.countBox}>04\nhrs</Text><Text style={styles.countSep}>:</Text><Text style={styles.countBox}>22\nmin</Text><Text style={styles.countSep}>:</Text><Text style={styles.countBox}>11\nsec</Text></View></View>
        </View>
        <TouchableOpacity style={styles.claimFull}><Text style={styles.claimFullText}>Claim this deal</Text></TouchableOpacity>
      </View>
      <View style={styles.sectionHeaderLine}><Text style={styles.refSectionTitle}>All deals near you</Text><Text style={styles.seeAllRed}>See all</Text></View>
      {[
        ['Free dessert with any main', "Mama's Kitchen · Karen", 'Save KES 350', '2 days left', '#EDF3EC', '#8AAB86'],
        ['Happy hour — 30% off drinks', 'Skylark Bar · Kilimani', '5–7 PM daily', 'Live now', '#F0ECE6', '#C4A882'],
        ['Set brunch for 2 · KES 1,800', 'Terrace Café · Lavington', 'Save KES 600', 'Weekends only', '#EEEDF5', '#9B97C4'],
      ].map(([name, rest, discount, expiry, bg, icon]) => <View key={name} style={styles.dealCardRef}><View style={[styles.dealLeftRef, { backgroundColor: bg }]}><Ionicons name="business" size={30} color={icon} /></View><View style={styles.dealInfoRef}><Text style={styles.dealNameRef}>{name}</Text><Text style={styles.dealRestRef}>{rest}</Text><View style={styles.dealFooterRef}><Text style={styles.dealDiscountRef}>{discount}</Text><View style={styles.claimRow}><Text style={styles.dealExpiryRef}>{expiry}</Text><Text style={styles.claimMini}>Claim</Text></View></View></View></View>)}
    </ScrollView>
    <BottomNav active="Deals" navigation={navigation} />
  </View>
);

const ReservationPreview = ({ navigation }: any) => {
  const [step, setStep] = useState(1);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState('1:00 PM');
  const [guests, setGuests] = useState(2);
  const monthGrid = buildMonthGrid();
  const formattedDate = selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <View style={styles.previewShell}>
      <View style={styles.reserveHeader}><View style={styles.reserveBackRow}><TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.navigate('Restaurant')}><Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.82)" /></TouchableOpacity><View style={styles.headerTitleBlock}><Text style={styles.reserveTitle}>Reserve a table</Text><Text style={styles.reserveRest}>The Rooftop Kitchen · Westlands</Text></View></View></View>
      <View style={styles.stepsRow}>
        <View style={styles.stepBlock}><Text style={step > 1 ? styles.stepCircleDone : styles.stepCircleActive}>{step > 1 ? '✓' : '1'}</Text><Text style={step === 1 ? styles.stepLabelActive : styles.stepLabel}>Date & time</Text></View><View style={styles.stepLine}/>
        <View style={styles.stepBlock}><Text style={step === 2 ? styles.stepCircleActive : step > 2 ? styles.stepCircleDone : styles.stepCircleInactive}>{step > 2 ? '✓' : '2'}</Text><Text style={step === 2 ? styles.stepLabelActive : styles.stepLabel}>Details</Text></View><View style={styles.stepLine}/>
        <View style={styles.stepBlock}><Text style={step === 3 ? styles.stepCircleActive : styles.stepCircleInactive}>3</Text><Text style={step === 3 ? styles.stepLabelActive : styles.stepLabel}>Confirm</Text></View>
      </View>
      <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${step * 33}%` }]}/></View>
      <ScrollView contentContainerStyle={styles.reserveBody}>
        {step === 1 ? <>
          <View style={styles.reserveCard}><Text style={styles.reserveCardTitle}>Pick a date</Text><View style={styles.calendarGrid}>{['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => <Text key={d} style={styles.dayLabel}>{d}</Text>)}{monthGrid.map((item) => {
            const active = item.date?.toDateString() === selectedDate.toDateString();
            return <TouchableOpacity key={item.key} disabled={item.blank || item.disabled} onPress={() => item.date && setSelectedDate(item.date)} style={styles.dateCellWrap}><Text style={[styles.dateCell, active && styles.dateCellActive, item.disabled && styles.datePast]}>{item.label}</Text></TouchableOpacity>;
          })}</View></View>
          <View style={styles.reserveCard}><Text style={styles.reserveCardTitle}>Pick a time</Text><View style={styles.timeGrid}>{['12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM\nFull','2:30 PM','7:00 PM','7:30 PM','8:00 PM'].map((t) => <TouchableOpacity key={t} disabled={t.includes('Full')} style={styles.timeChipWrap} onPress={() => setSelectedTime(t)}><Text style={[styles.timeChip, selectedTime === t && styles.timeChipActive, t.includes('Full') && styles.timeChipFull]}>{t}</Text></TouchableOpacity>)}</View></View>
          <View style={styles.reserveCard}><View style={styles.guestRow}><Text style={styles.guestLabel}>Number of guests</Text><View style={styles.guestControls}><TouchableOpacity onPress={() => setGuests(Math.max(1, guests - 1))}><Text style={styles.guestBtn}>-</Text></TouchableOpacity><Text style={styles.guestNum}>{guests}</Text><TouchableOpacity onPress={() => setGuests(guests + 1)}><Text style={styles.guestBtn}>+</Text></TouchableOpacity></View></View></View>
          <TouchableOpacity style={styles.button} onPress={() => setStep(2)}><Text style={styles.buttonText}>Continue</Text></TouchableOpacity>
        </> : null}
        {step === 2 ? <>
          <View style={styles.reserveCard}><Text style={styles.reserveCardTitle}>Booking summary</Text><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Date</Text><Text style={styles.summaryVal}>{formattedDate}</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Time</Text><Text style={styles.summaryVal}>{selectedTime.replace('\nFull', '')}</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Guests</Text><Text style={styles.summaryVal}>{guests} people</Text></View><View style={styles.summaryRowLast}><Text style={styles.summaryLabel}>Est. budget</Text><Text style={styles.summaryValRed}>≈ KES 1,250 / person</Text></View></View>
          <View style={styles.reserveCard}><Text style={styles.reserveCardTitle}>Your details</Text><Text style={styles.inputLabel}>Full name</Text><TextInput style={styles.detailInput} defaultValue="Brian Kamau" /><Text style={styles.inputLabel}>Phone number</Text><TextInput style={styles.detailInput} defaultValue="+254 712 345 678" keyboardType="phone-pad" /><Text style={styles.inputLabel}>Special requests (optional)</Text><TextInput style={[styles.detailInput, styles.noteInput]} multiline placeholder="e.g. window seat, birthday celebration..." placeholderTextColor="#AAAAAA" /></View>
          <View style={styles.infoBox}><Ionicons name="information-circle-outline" size={17} color="#E23744" /><Text style={styles.infoText}>Free cancellation up to 2 hours before your booking</Text></View>
          <TouchableOpacity style={styles.button} onPress={() => setStep(3)}><Text style={styles.buttonText}>Review booking</Text></TouchableOpacity>
        </> : null}
        {step === 3 ? <View style={styles.confirmScreen}><View style={styles.confirmIcon}><Ionicons name="checkmark" size={28} color="#E23744" /></View><Text style={styles.confirmTitle}>Booking confirmed</Text><Text style={styles.confirmSub}>Your table at The Rooftop Kitchen is reserved. We sent the details to your phone.</Text><View style={styles.reserveCardWide}><Text style={styles.reserveCardTitle}>Reservation details</Text><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Date</Text><Text style={styles.summaryVal}>{formattedDate}</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Time</Text><Text style={styles.summaryVal}>{selectedTime.replace('\nFull', '')}</Text></View><View style={styles.summaryRowLast}><Text style={styles.summaryLabel}>Guests</Text><Text style={styles.summaryVal}>{guests} people</Text></View></View><TouchableOpacity style={styles.buttonFull} onPress={() => navigation.navigate('Home')}><Text style={styles.buttonText}>Back to home</Text></TouchableOpacity><TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(1)}><Text style={styles.secondaryButtonText}>Make another reservation</Text></TouchableOpacity></View> : null}
      </ScrollView>
      <BottomNav active="Reserve" navigation={navigation} />
    </View>
  );
};

const ProfilePreview = ({ navigation, email, savedRestaurants }: any) => (
  <View style={styles.previewShell}>
    <PreviewHeader title="Profile" subtitle={email || 'preview@cravyapp.com'} navigation={navigation} />
    <ScrollView contentContainerStyle={styles.previewContent}>
      <View style={styles.rowCard}>
        <Text style={styles.cardTitle}>Saved restaurants</Text>
        <Text style={styles.cardMeta}>{savedRestaurants.length ? savedRestaurants.join(' · ') : 'Tap the heart on any restaurant to save it here.'}</Text>
      </View>
      {['Reservations', 'Payment methods', 'Preferences'].map((item) => <View key={item} style={styles.rowCard}><Text style={styles.cardTitle}>{item}</Text><Text style={styles.cardMeta}>Preview mode</Text></View>)}
    </ScrollView>
    <BottomNav active="Profile" navigation={navigation} />
  </View>
);

const BottomNav = ({ active, navigation }: any) => (
  <View style={styles.bottomNav}>{[['home', 'Home', 'Home'], ['search', 'Discover', 'AllRestaurants'], ['calendar', 'Events', 'Events'], ['pricetag', 'Deals', 'Deals'], ['person', 'Profile', 'Profile']].map(([icon, label, target]) => <TouchableOpacity key={label} style={styles.navItem} onPress={() => navigation.navigate(target)}><Ionicons name={icon as any} size={22} color={active === label ? '#E23744' : '#BDBDBD'} /><Text style={[styles.navLabel, active === label && styles.navLabelActive]}>{label}</Text></TouchableOpacity>)}</View>
);

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: '#F7F5F2', justifyContent: 'center', padding: 24 },
  logoWrap: { alignItems: 'center', marginBottom: 22 },
  logoIcon: { width: 82, height: 82, borderRadius: 22, backgroundColor: '#E23744', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 10 },
  steamRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', marginBottom: 7 },
  steamDot: { width: 8, height: 24, borderRadius: 5, backgroundColor: '#FFFFFF' },
  steamDotTall: { height: 32 },
  bowlRim: { width: 52, height: 8, borderRadius: 5, backgroundColor: '#FFFFFF' },
  bowlBody: { width: 58, height: 31, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, backgroundColor: '#FFFFFF', alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: 5, paddingBottom: 5 },
  kesTag: { backgroundColor: '#FFF5F5', borderRadius: 5, paddingHorizontal: 4, paddingVertical: 1 },
  kesText: { color: '#E23744', fontSize: 8, fontWeight: '900' },
  logoWord: { color: '#1A1A1A', fontSize: 30, fontWeight: '900', letterSpacing: 1 },
  logoTagline: { color: '#E23744', fontSize: 10, fontWeight: '800', letterSpacing: 3, marginTop: 3 },
  title: { color: '#1A1A1A', fontSize: 31, fontWeight: '900', lineHeight: 36, marginBottom: 10 },
  subtitle: { color: '#666666', fontSize: 15, lineHeight: 22, marginBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 18, padding: 18 },
  label: { color: '#1A1A1A', fontSize: 13, fontWeight: '800', marginBottom: 7 },
  input: { backgroundColor: '#F7F5F2', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, color: '#1A1A1A', marginBottom: 14 },
  button: { backgroundColor: '#E23744', borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  previewShell: { flex: 1, backgroundColor: '#F7F5F2' },
  previewHeader: { backgroundColor: '#E23744', paddingTop: HEADER_TOP_PADDING, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  previewTitle: { color: '#FFFFFF', fontSize: 23, fontWeight: '900' },
  previewSubtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },
  previewContent: { padding: 16, paddingBottom: 98 },
  listCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 14, padding: 12, marginBottom: 12 },
  rowCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 14, padding: 14, marginBottom: 10 },
  imageBlock: { height: 86, borderRadius: 12, backgroundColor: '#F5ECE0', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  restaurantTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  cardTitle: { color: '#1A1A1A', fontSize: 16, fontWeight: '900', flex: 1 },
  saveButtonSmall: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF4F4' },
  cardMeta: { color: '#888888', fontSize: 13, marginTop: 4 },
  redAction: { color: '#E23744', fontSize: 13, fontWeight: '900', marginTop: 10 },
  darkCard: { backgroundColor: '#1A1A1A', borderRadius: 15, padding: 16, marginBottom: 12 },
  dealTag: { alignSelf: 'flex-start', backgroundColor: '#E23744', color: '#FFFFFF', borderRadius: 999, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 4, fontSize: 12, fontWeight: '900', marginBottom: 10 },
  darkTitle: { color: '#FFFFFF', fontSize: 19, fontWeight: '900' },
  darkMeta: { color: 'rgba(255,255,255,0.62)', fontSize: 13, marginTop: 3 },
  darkPrice: { color: '#E23744', fontSize: 25, fontWeight: '900', marginTop: 12 },

  tabBar: { flexDirection: 'row', backgroundColor: '#F7F5F2', borderBottomWidth: 1, borderBottomColor: '#EBEBEB' },
  tabActive: { flex: 1, textAlign: 'center', color: '#E23744', fontSize: 14, fontWeight: '900', paddingVertical: 13, borderBottomWidth: 2, borderBottomColor: '#E23744' },
  tabText: { flex: 1, textAlign: 'center', color: '#888888', fontSize: 14, fontWeight: '800', paddingVertical: 13 },
  menuSection: { color: '#888888', fontSize: 12, fontWeight: '900', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 },
  menuLine: { color: '#1A1A1A', fontSize: 15, fontWeight: '800', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  budgetBox: { backgroundColor: '#FFF4F4', borderWidth: 1, borderColor: '#FCD5D5', borderRadius: 12, padding: 14, marginBottom: 12 },
  budgetTitle: { color: '#A32D2D', fontSize: 14, fontWeight: '900' },

  dealsHeader: { backgroundColor: '#E23744', paddingHorizontal: 16, paddingTop: HEADER_TOP_PADDING, paddingBottom: 20 },
  headerTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12 },
  headerTitleBlock: { flex: 1, minWidth: 0 },
  dealsTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  dealsSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  headerBell: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  dealsSearch: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8 },
  dealsSearchText: { color: '#AAAAAA', fontSize: 14, flex: 1 },
  headerSearch: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerSearchText: { color: '#AAAAAA', fontSize: 14, flex: 1 },
  searchFilterIcon: { marginLeft: 'auto' },
  dealFilters: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, gap: 9, alignItems: 'center' },
  dealFilter: { fontSize: 12, lineHeight: 18, minHeight: 36, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#DDDDDD', backgroundColor: '#FFFFFF', color: '#444444', overflow: 'hidden' },
  dealFilterActive: { backgroundColor: '#1A1A1A', color: '#FFFFFF', borderColor: '#1A1A1A' },
  happyHourBand: { backgroundColor: '#FFF4F4', borderWidth: 1, borderColor: '#FCD5D5', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  hhTitle: { color: '#A32D2D', fontSize: 13, fontWeight: '800' },
  hhSub: { color: '#C04040', fontSize: 11, marginTop: 2 },
  liveBadge: { backgroundColor: '#E23744', color: '#FFFFFF', borderRadius: 20, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 3, fontSize: 10, fontWeight: '800' },
  refSectionTitle: { color: '#1A1A1A', fontSize: 14, fontWeight: '800', marginBottom: 10 },
  featuredDealRef: { backgroundColor: '#1A1A1A', borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
  featureStrip: { backgroundColor: '#2A1A1A', height: 6 },
  featureInner: { padding: 14 },
  featureTag: { alignSelf: 'flex-start', backgroundColor: '#E23744', color: '#FFFFFF', borderRadius: 20, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 3, fontSize: 10, fontWeight: '800', marginBottom: 8 },
  featureTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  featureRest: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2, marginBottom: 10 },
  featurePills: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  featurePill: { backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', borderRadius: 6, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 4, fontSize: 11 },
  featureFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  priceNow: { color: '#E23744', fontSize: 20, fontWeight: '900' },
  priceWas: { color: 'rgba(255,255,255,0.4)', fontSize: 12, textDecorationLine: 'line-through' },
  countdown: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  countBox: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: 6, overflow: 'hidden', paddingHorizontal: 7, paddingVertical: 4, fontSize: 9, textAlign: 'center', fontWeight: '800' },
  countSep: { color: 'rgba(255,255,255,0.4)', fontWeight: '900' },
  claimFull: { marginHorizontal: 14, marginBottom: 14, backgroundColor: '#E23744', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  claimFullText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  sectionHeaderLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAllRed: { color: '#E23744', fontSize: 12, fontWeight: '700' },
  dealCardRef: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EBEBEB', overflow: 'hidden', marginBottom: 10, flexDirection: 'row' },
  dealLeftRef: { width: 80, alignItems: 'center', justifyContent: 'center' },
  dealInfoRef: { flex: 1, paddingHorizontal: 12, paddingVertical: 10 },
  dealNameRef: { color: '#1A1A1A', fontSize: 13, fontWeight: '800' },
  dealRestRef: { color: '#888888', fontSize: 11, marginTop: 2, marginBottom: 6 },
  dealFooterRef: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dealDiscountRef: { backgroundColor: '#FFF4F4', color: '#A32D2D', borderRadius: 6, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 3, fontSize: 11, fontWeight: '800' },
  claimRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dealExpiryRef: { color: '#AAAAAA', fontSize: 11 },
  claimMini: { backgroundColor: '#E23744', color: '#FFFFFF', borderRadius: 8, overflow: 'hidden', paddingHorizontal: 12, paddingVertical: 5, fontSize: 11, fontWeight: '800' },

  eventsHeader: { backgroundColor: '#E23744', paddingHorizontal: 16, paddingTop: HEADER_TOP_PADDING, paddingBottom: 18 },
  eventsTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  eventsSub: { color: 'rgba(255,255,255,0.72)', fontSize: 12, marginTop: 2 },
  weekStripRef: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EBEBEB', paddingHorizontal: 10, paddingRight: 18 },
  weekDayRef: { alignItems: 'center', paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: 'transparent', minWidth: 58 },
  weekDayActiveRef: { borderBottomColor: '#E23744' },
  weekLabelRef: { color: '#AAAAAA', fontSize: 10 },
  weekNumRef: { color: '#444444', fontSize: 14, fontWeight: '800', marginTop: 4 },
  weekTextActive: { color: '#E23744' },
  weekDotRef: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#E23744', marginTop: 4 },
  eventsBody: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 96 },
  featuredEventRef: { backgroundColor: '#1A1A1A', borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
  feTop: { backgroundColor: '#2D1A1E', padding: 14 },
  feBadge: { alignSelf: 'flex-start', backgroundColor: '#E23744', color: '#FFFFFF', borderRadius: 20, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 3, fontSize: 10, fontWeight: '800', marginBottom: 8 },
  feTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 3 },
  feLoc: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 10 },
  feTags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  feTag: { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', borderRadius: 6, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 3, fontSize: 10 },
  feBottom: { paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fePriceLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginBottom: 2 },
  fePrice: { color: '#E23744', fontSize: 18, fontWeight: '900' },
  ticketActionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ticketsLeftDark: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
  feButton: { backgroundColor: '#E23744', color: '#FFFFFF', borderRadius: 10, overflow: 'hidden', paddingHorizontal: 16, paddingVertical: 8, fontSize: 12, fontWeight: '800' },
  eventCardRef: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EBEBEB', overflow: 'hidden', marginBottom: 8, flexDirection: 'row' },
  eventDateRef: { backgroundColor: '#FFF4F4', paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', minWidth: 46 },
  eventDayRef: { color: '#E23744', fontSize: 18, fontWeight: '900', lineHeight: 20 },
  eventMonthRef: { color: '#E23744', fontSize: 9, textTransform: 'uppercase' },
  eventInfoRef: { flex: 1, paddingHorizontal: 10, paddingVertical: 10 },
  eventNameRef: { color: '#1A1A1A', fontSize: 13, fontWeight: '800' },
  eventLocRef: { color: '#888888', fontSize: 11, marginTop: 2, marginBottom: 6 },
  eventFooterRef: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventPriceRef: { color: '#E23744', fontSize: 12, fontWeight: '900' },
  eventTypeRef: { backgroundColor: '#F5F5F5', color: '#666666', borderRadius: 6, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 3, fontSize: 10 },
  ticketsLeftRef: { backgroundColor: '#FFF4F4', color: '#A32D2D', borderRadius: 6, overflow: 'hidden', paddingHorizontal: 7, paddingVertical: 2, fontSize: 10 },
  reserveHeader: { backgroundColor: '#E23744', paddingHorizontal: 16, paddingTop: HEADER_TOP_PADDING, paddingBottom: 14 },
  reserveBackRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reserveTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  reserveRest: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  stepsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E23744', paddingHorizontal: 16, paddingBottom: 14 },
  stepBlock: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  stepCircleActive: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFFFF', color: '#E23744', textAlign: 'center', lineHeight: 22, fontSize: 11, fontWeight: '900', overflow: 'hidden' },
  stepCircleInactive: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.25)', color: '#FFFFFF', textAlign: 'center', lineHeight: 22, fontSize: 11, fontWeight: '900', overflow: 'hidden' },
  stepLabelActive: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  stepLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10 },
  stepLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 4 },
  progressBar: { height: 3, backgroundColor: '#FCD5D5' },
  progressFill: { height: 3, backgroundColor: '#E23744' },
  reserveBody: { padding: 16, paddingBottom: 96 },
  reserveCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EBEBEB', padding: 14, marginBottom: 10 },
  reserveCardTitle: { color: '#1A1A1A', fontSize: 13, fontWeight: '800', marginBottom: 10 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayLabel: { width: '14.28%', textAlign: 'center', color: '#AAAAAA', fontSize: 10, marginBottom: 6 },
  dateCellWrap: { width: '14.28%', padding: 2 },
  dateCell: { textAlign: 'center', color: '#444444', fontSize: 12, paddingVertical: 8, borderRadius: 8, overflow: 'hidden' },
  dateCellActive: { backgroundColor: '#E23744', color: '#FFFFFF', fontWeight: '900' },
  datePast: { color: '#CCCCCC' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  timeChipWrap: { width: '31%' },
  timeChip: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingVertical: 7, textAlign: 'center', color: '#444444', fontSize: 12, overflow: 'hidden' },
  timeChipActive: { backgroundColor: '#E23744', color: '#FFFFFF', borderColor: '#E23744', fontWeight: '900' },
  timeChipFull: { backgroundColor: '#F5F5F5', color: '#CCCCCC', fontSize: 11 },
  guestRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  guestLabel: { color: '#444444', fontSize: 13 },
  guestControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  guestBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#DDDDDD', textAlign: 'center', lineHeight: 28, color: '#444444', fontSize: 16, overflow: 'hidden' },
  guestNum: { color: '#1A1A1A', fontSize: 16, fontWeight: '900' },
  stepCircleDone: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFFFF', color: '#E23744', textAlign: 'center', lineHeight: 22, fontSize: 11, fontWeight: '900', overflow: 'hidden' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', gap: 12 },
  summaryRowLast: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 7, gap: 12 },
  summaryLabel: { color: '#888888', fontSize: 12 },
  summaryVal: { color: '#1A1A1A', fontSize: 12, fontWeight: '800', flexShrink: 1, textAlign: 'right' },
  summaryValRed: { color: '#E23744', fontSize: 12, fontWeight: '900', flexShrink: 1, textAlign: 'right' },
  inputLabel: { color: '#888888', fontSize: 11, marginBottom: 4 },
  detailInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: '#1A1A1A', backgroundColor: '#FAFAFA', marginBottom: 8, fontSize: 13 },
  noteInput: { minHeight: 64, textAlignVertical: 'top' },
  infoBox: { backgroundColor: '#FFF4F4', borderWidth: 1, borderColor: '#FCD5D5', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { color: '#A32D2D', fontSize: 11, lineHeight: 16, flex: 1 },
  confirmScreen: { alignItems: 'center', paddingTop: 12 },
  confirmIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF4F4', borderWidth: 2, borderColor: '#E23744', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  confirmTitle: { color: '#1A1A1A', fontSize: 17, fontWeight: '900', marginBottom: 4, textAlign: 'center' },
  confirmSub: { color: '#888888', fontSize: 12, lineHeight: 18, textAlign: 'center', marginBottom: 14 },
  reserveCardWide: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EBEBEB', padding: 14, marginBottom: 12 },
  buttonFull: { width: '100%', backgroundColor: '#E23744', borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
  secondaryButton: { width: '100%', borderWidth: 1, borderColor: '#E23744', borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginTop: 8 },
  secondaryButtonText: { color: '#E23744', fontSize: 13, fontWeight: '900' },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EBEBEB', paddingTop: 8, paddingBottom: 14 },
  navItem: { alignItems: 'center', gap: 3 },
  navLabel: { color: '#BDBDBD', fontSize: 11 },
  navLabelActive: { color: '#E23744', fontWeight: '900' },
});
