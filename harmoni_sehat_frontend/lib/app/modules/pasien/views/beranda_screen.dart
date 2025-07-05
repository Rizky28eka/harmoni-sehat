import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PasienBerandaScreen extends StatefulWidget {
  const PasienBerandaScreen({super.key});

  @override
  State<PasienBerandaScreen> createState() => _PasienBerandaScreenState();
}

class Hospital {
  final int id;
  final String name;
  final String address;
  final String imageUrl;
  final String phoneNumber;

  Hospital({
    required this.id,
    required this.name,
    required this.address,
    required this.imageUrl,
    required this.phoneNumber,
  });

  factory Hospital.fromJson(Map<String, dynamic> json) {
    return Hospital(
      id: json['id'],
      name: json['name'],
      address: json['address'],
      imageUrl: json['image_url'] ?? 'https://via.placeholder.com/150', // Default image if null
      phoneNumber: json['phone_number'] ?? 'N/A',
    );
  }
}

class _PasienBerandaScreenState extends State<PasienBerandaScreen> {
  String _currentAddress = 'Loading...';
  List<Hospital> _hospitals = [];
  bool _isLoadingHospitals = true;
  String _hospitalError = '';
  final Set<int> _favoriteHospitalIds = {}; // New state for favorite hospitals

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
    _fetchHospitals();
  }

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      setState(() {
        _currentAddress = 'Location services are disabled.';
      });
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        setState(() {
          _currentAddress = 'Location permissions are denied';
        });
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      setState(() {
        _currentAddress = 'Location permissions are permanently denied';
      });
      return;
    }

    try {
      Position position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high);
      List<Placemark> placemarks = await placemarkFromCoordinates(
          position.latitude, position.longitude);

      if (placemarks.isNotEmpty) {
        Placemark place = placemarks[0];
        setState(() {
          _currentAddress = "${place.locality}, ${place.country}";
        });
      } else {
        setState(() {
          _currentAddress = "No address found";
        });
      }
    } catch (e) {
      setState(() {
        _currentAddress = "Failed to get location";
      });
    }
  }

  Future<void> _fetchHospitals() async {
    setState(() {
      _isLoadingHospitals = true;
      _hospitalError = '';
    });
    try {
      final response = await http.get(
          Uri.parse('http://192.168.1.14:5000/api/hospitals'));

      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(response.body);
        setState(() {
          _hospitals = data.map((json) => Hospital.fromJson(json)).toList();
          _isLoadingHospitals = false;
        });
      } else {
        setState(() {
          _hospitalError = 'Failed to load hospitals: ${response.statusCode}';
          _isLoadingHospitals = false;
        });
      }
    } catch (e) {
      setState(() {
        _hospitalError = 'Error fetching hospitals: $e';
        _isLoadingHospitals = false;
      });
    }
  }

  void _toggleFavoriteHospital(int hospitalId) {
    setState(() {
      if (_favoriteHospitalIds.contains(hospitalId)) {
        _favoriteHospitalIds.remove(hospitalId);
      } else {
        _favoriteHospitalIds.add(hospitalId);
      }
    });
  }

  Future<void> _onRefresh() async {
    await Future.wait([
      _getCurrentLocation(),
      _fetchHospitals(),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    const Color primaryColor = Color(0xFF1c8086);

    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        systemOverlayStyle: SystemUiOverlayStyle.dark,
        title: Row(
          children: [
            const Icon(Icons.location_on, color: primaryColor),
            const SizedBox(width: 8),
            Text(
              _currentAddress,
              style: const TextStyle(
                  color: Colors.black,
                  fontSize: 16,
                  fontWeight: FontWeight.w500),
            ),
            const Icon(Icons.expand_more, color: Colors.black),
          ],
        ),
        actions: [
          Stack(
            alignment: Alignment.topRight,
            children: [
              IconButton(
                onPressed: () {},
                icon: const Icon(
                  Icons.notifications_outlined,
                  color: Colors.black,
                  size: 28,
                ),
              ),
              Container(
                margin: const EdgeInsets.only(top: 12, right: 12),
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: Colors.red,
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _onRefresh,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          physics: const AlwaysScrollableScrollPhysics(), // Always allow scrolling for RefreshIndicator
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSearch(primaryColor),
              const SizedBox(height: 24),
              _buildSectionHeader('Upcoming Schedule', '8'),
              const SizedBox(height: 16),
              _buildUpcomingScheduleCard(primaryColor),
              const SizedBox(height: 24),
              _buildSectionHeader('Doctor Speciality'),
              const SizedBox(height: 16),
              _buildDoctorSpeciality(primaryColor),
              const SizedBox(height: 24),
              _buildSectionHeader('Nearby Hospitals'),
              const SizedBox(height: 16),
              _buildNearbyHospitals(),
              const SizedBox(height: 24),
              _buildSectionHeader('Doctor Recommendation'),
              const SizedBox(height: 16),
              _buildDoctorRecommendation(primaryColor),
              const SizedBox(height: 24),
              _buildSectionHeader('Health Articles / Tips Kesehatan'),
              const SizedBox(height: 16),
              _buildHealthArticles(),
              const SizedBox(height: 24),
              _buildSectionHeader('Promo & Campaigns'),
              const SizedBox(height: 16),
              _buildPromoCampaigns(),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Handle Live Chat / Quick Ask
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Live Chat / Quick Ask tapped!')),
          );
        },
        backgroundColor: primaryColor,
        child: const Icon(Icons.chat_bubble_outline, color: Colors.white),
      ),
    );
  }

  Widget _buildSectionHeader(String title, [String? count]) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            if (count != null) const SizedBox(width: 8),
            if (count != null)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF1c8086).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  count,
                  style: const TextStyle(
                    color: Color(0xFF1c8086),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
          ],
        ),
        const Text(
          'See All',
          style: TextStyle(
            color: Color(0xFF1c8086),
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildSearch(Color primaryColor) {
    return Row(
      children: [
        Expanded(
          child: TextField(
            decoration: InputDecoration(
              hintText: 'Search',
              hintStyle: TextStyle(color: Colors.grey[600]),
              prefixIcon: Icon(Icons.search, color: Colors.grey[600]),
              suffixIcon: IconButton(
                icon: Icon(
                  Icons.mic_none,
                  color: Colors.grey[600],
                ), // Microphone icon
                onPressed: () {},
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(
                vertical: 14,
                horizontal: 16,
              ),
            ),
          ),
        ),
        const SizedBox(width: 16),
        Container(
          decoration: BoxDecoration(
            color: primaryColor,
            borderRadius: BorderRadius.circular(12),
          ),
          child: IconButton(
            onPressed: () {},
            icon: const Icon(
              Icons.filter_list,
              color: Colors.white,
            ), // Filter icon
          ),
        ),
      ],
    );
  }

  Widget _buildUpcomingScheduleCard(Color primaryColor) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: primaryColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: primaryColor.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              const CircleAvatar(
                radius: 25,
                backgroundImage: NetworkImage(
                  'https://i.pravatar.cc/150?img=56',
                ),
              ),
              const SizedBox(width: 16),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Dr. Alana Rueter',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Dentist Consultation',
                    style: TextStyle(color: Colors.white70, fontSize: 14),
                  ),
                ],
              ),
              const Spacer(),
              Container(
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  onPressed: () {},
                  icon: Icon(Icons.call, color: primaryColor),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(color: Colors.white30),
          const SizedBox(height: 8),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.calendar_today, color: Colors.white70, size: 16),
                  SizedBox(width: 8),
                  Text(
                    'Monday, 26 July',
                    style: TextStyle(color: Colors.white, fontSize: 14),
                  ),
                ],
              ),
              Row(
                children: [
                  Icon(
                    Icons.access_time_filled,
                    color: Colors.white70,
                    size: 16,
                  ),
                  SizedBox(width: 8),
                  Text(
                    '09:00 - 10:00',
                    style: TextStyle(color: Colors.white, fontSize: 14),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDoctorSpeciality(Color primaryColor) {
    final specialities = [
      {'icon': Icons.local_hospital, 'label': 'Dentist'},
      {'icon': Icons.favorite, 'label': 'Cardiolo..'},
      {'icon': Icons.healing, 'label': 'Orthopae..'},
      {'icon': Icons.psychology, 'label': 'Neurolo..'},
      {'icon': Icons.local_hospital, 'label': 'Umum'},
      {'icon': Icons.pregnant_woman, 'label': 'Obgyn'},
      {'icon': Icons.remove_red_eye, 'label': 'Mata'},
      {'icon': Icons.earbuds, 'label': 'THT'},
    ];

    return SizedBox(
      height: 110,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(), // For snapping feel
        itemCount: specialities.length,
        separatorBuilder: (context, index) => const SizedBox(width: 20),
        itemBuilder: (context, index) {
          final speciality = specialities[index];
          return Column(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.2),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Icon(
                  speciality['icon'] as IconData,
                  color: primaryColor,
                  size: 28,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                speciality['label'] as String,
                style: const TextStyle(
                    color: Colors.black54, fontWeight: FontWeight.w500, fontSize: 10),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildNearbyHospitals() {
    if (_isLoadingHospitals) {
      return const Center(child: CircularProgressIndicator());
    } else if (_hospitalError.isNotEmpty) {
      return Center(child: Text(_hospitalError));
    } else if (_hospitals.isEmpty) {
      return const Center(child: Text('No hospitals found.'));
    } else {
      return SizedBox(
        height: 220,
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          itemCount: _hospitals.length,
          separatorBuilder: (context, index) => const SizedBox(width: 16),
          itemBuilder: (context, index) {
            final hospital = _hospitals[index];
            final isFavorite = _favoriteHospitalIds.contains(hospital.id);
            return Container(
              width: 110, // Reduced width
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.05),
                    blurRadius: 10,
                    spreadRadius: 0,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Stack(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(
                          16,
                        ), // Rounded corner for image
                        child: Image.network(
                          hospital.imageUrl,
                          height: 100, // Increased height
                          width: double.infinity,
                          fit: BoxFit.cover,
                        ),
                      ),
                      Positioned(
                        top: 8,
                        right: 8,
                        child: GestureDetector(
                          onTap: () => _toggleFavoriteHospital(hospital.id),
                          child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.8),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              isFavorite
                                  ? Icons.favorite
                                  : Icons.favorite_border,
                              color: isFavorite ? Colors.red : Colors.grey,
                              size: 20,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          hospital.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 16,
                          ), // Semi-bold, larger font
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4), // Reduced spacing
                        Text(
                          hospital.address, // Display address
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 12,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          '2.1 km', // Placeholder for distance
                          style: TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ), // Reduced padding
                          decoration: BoxDecoration(
                            color: Colors.amber.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.star,
                                color: Colors.amber,
                                size: 14,
                              ), // Adjusted icon size
                              SizedBox(width: 2), // Reduced spacing
                              Text(
                                '4.8', // Placeholder for rating, as API doesn't provide it yet
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black87,
                                  fontSize: 12,
                                ), // Adjusted font size
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      );
    }
  }

  Widget _buildDoctorRecommendation(Color primaryColor) {
    final doctors = [
      {
        'image': 'https://i.pravatar.cc/150?img=60',
        'name': 'Dr. Sarah Connor',
        'speciality': 'Pediatrician',
        'rating': '4.9',
        'isOnline': true,
        'specializationIcon': Icons.child_care, // Example icon
      },
      {
        'image': 'https://i.pravatar.cc/150?img=61',
        'name': 'Dr. John Doe',
        'speciality': 'General Practitioner',
        'rating': '4.7',
        'isOnline': false,
        'specializationIcon': Icons.medical_services, // Example icon
      },
      {
        'image': 'https://i.pravatar.cc/150?img=62',
        'name': 'Dr. Jane Smith',
        'speciality': 'Dermatologist',
        'rating': '4.5',
        'isOnline': true,
        'specializationIcon': Icons.healing, // Example icon
      },
    ];

    return SizedBox(
      height: 190,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: doctors.length,
        separatorBuilder: (context, index) => const SizedBox(width: 16),
        itemBuilder: (context, index) {
          final doctor = doctors[index];
          return Container(
            width: 110, // Reduced width
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.05),
                  blurRadius: 10,
                  spreadRadius: 0,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Stack(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(
                        16,
                      ), // Rounded corner for image
                      child: Image.network(
                        doctor['image'] as String,
                        height: 80, // Reduced height
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Positioned(
                      bottom: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: primaryColor,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          doctor['specializationIcon'] as IconData,
                          color: Colors.white,
                          size: 16,
                        ),
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        doctor['name'] as String,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ), // Larger font
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        doctor['speciality'] as String,
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(Icons.star, color: Colors.amber, size: 14),
                          const SizedBox(width: 4),
                          Text(
                            doctor['rating'] as String,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                              fontSize: 12,
                            ),
                          ),
                          const Spacer(),
                          if (doctor['isOnline'] == true)
                            Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: Colors.green,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                const Text(
                                  'Online',
                                  style: TextStyle(
                                    color: Colors.green,
                                    fontSize: 10,
                                  ),
                                ),
                              ],
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildHealthArticles() {
    final articles = [
      {
        'image': 'https://picsum.photos/seed/article1/200/150',
        'title': 'Tips Menjaga Kesehatan Jantung',
        'date': '10 Juli 2024',
      },
      {
        'image': 'https://picsum.photos/seed/article2/200/150',
        'title': 'Pentingnya Vaksinasi Anak',
        'date': '05 Juli 2024',
      },
      {
        'image': 'https://picsum.photos/seed/article3/200/150',
        'title': 'Mengenal Gejala Diabetes',
        'date': '01 Juli 2024',
      },
    ];

    return SizedBox(
      height: 180,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: articles.length,
        separatorBuilder: (context, index) => const SizedBox(width: 16),
        itemBuilder: (context, index) {
          final article = articles[index];
          return Container(
            width: 180,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  blurRadius: 10,
                  spreadRadius: 1,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(16),
                  ),
                  child: Image.network(
                    article['image'] as String,
                    height: 100,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        article['title'] as String,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        article['date'] as String,
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildPromoCampaigns() {
    final promos = [
      {
        'image': 'https://picsum.photos/seed/promo1/300/150',
        'title': 'Diskon Vaksin Flu',
      },
      {
        'image': 'https://picsum.photos/seed/promo2/300/150',
        'title': 'Paket Check-up Kesehatan',
      },
      {
        'image': 'https://picsum.photos/seed/promo3/300/150',
        'title': 'Program Donor Darah',
      },
    ];

    return SizedBox(
      height: 150,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: promos.length,
        separatorBuilder: (context, index) => const SizedBox(width: 16),
        itemBuilder: (context, index) {
          final promo = promos[index];
          return Container(
            width: 250,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  blurRadius: 10,
                  spreadRadius: 1,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Stack(
                children: [
                  Image.network(
                    promo['image'] as String,
                    height: double.infinity,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.black.withOpacity(0.7),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 12,
                    left: 12,
                    right: 12,
                    child: Text(
                      promo['title'] as String,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

}

// Using FontAwesomeIcons for better icon matching from the reference
class FontAwesomeIcons {
  static const IconData tooth = IconData(
    0xf529,
    fontFamily: 'FontAwesomeSolid',
    fontPackage: 'font_awesome_flutter',
  );
  static const IconData heartPulse = IconData(
    0xf21e,
    fontFamily: 'FontAwesomeSolid',
    fontPackage: 'font_awesome_flutter',
  );
  static const IconData bone = IconData(
    0xf5d7,
    fontFamily: 'FontAwesomeSolid',
    fontPackage: 'font_awesome_flutter',
  );
  static const IconData brain = IconData(
    0xf5dc,
    fontFamily: 'FontAwesomeSolid',
    fontPackage: 'font_awesome_flutter',
  );
}