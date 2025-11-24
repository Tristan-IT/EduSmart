import mongoose from "mongoose";
import UserModel from "./src/models/User.js";
import { getSchoolAlerts, getSchoolPerformanceMetrics, getRecentActivity } from "./src/services/schoolAnalyticsService.js";

async function testAPIs() {
  try {
    console.log("🔄 Connecting to database...");
    await mongoose.connect("mongodb+srv://portal_db:ionMtId5RzD6xb4t@portal.0vma0yo.mongodb.net/adapti_portal?appName=Portal");

    const user = await UserModel.findOne({ email: 'kepala.sekolah@smktiglobal.sch.id' });
    console.log('User found:', user.name);

    console.log('\n📊 Testing School Alerts API...');
    const alerts = await getSchoolAlerts('SCH-00001', user._id.toString());
    console.log('Alerts result:', alerts);

    console.log('\n📈 Testing Performance Metrics API...');
    const performance = await getSchoolPerformanceMetrics('SCH-00001', user._id.toString());
    console.log('Performance result:', performance);

    console.log('\n📅 Testing Recent Activity API...');
    const activities = await getRecentActivity('SCH-00001', user._id.toString(), 3);
    console.log('Recent Activities result:', activities);

    console.log('\n✅ All API tests completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

testAPIs();