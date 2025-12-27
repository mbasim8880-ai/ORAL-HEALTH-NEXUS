
export const DENTAL_TIPS = [
  "Don't forget to brush your tongue to remove 90% of mouth bacteria!",
  "Replace your toothbrush every 3 months for better hygiene.",
  "Flossing once a day can add years to your teeth's life.",
  "Wait 30 minutes after eating acidic food before you brush.",
  "Drinking water after every meal helps wash away sugar and acid.",
  "Use a soft-bristled brush to protect your gums from recession.",
  "Fluoride is your teeth's natural shield against cavities.",
  "Avoid snacking on sugary treats between meals to prevent plaque.",
  "Calcium-rich foods like yogurt and cheese strengthen tooth enamel.",
  "Crunchy fruits and veggies like apples act as natural toothbrushes.",
  "Check your gums: they should be pink and firm, not red or puffy.",
  "Limit coffee and tea to prevent long-term staining on your enamel.",
  "Never use your teeth as tools to open packages or bottles.",
  "Visit your dentist twice a year for professional deep cleaning.",
  "Changing your brush after being sick prevents germ reinfection.",
  "Electric toothbrushes are more efficient at plaque removal.",
  "The best time to floss is right before your nighttime brush.",
  "Dry mouth increases decay risk; stay hydrated for saliva flow.",
  "Straws are great for protecting teeth from acidic beverages.",
  "Mouthwash is a supplement, not a replacement for brushing.",
  "Vitamin C is essential for maintaining healthy gum tissue.",
  "Quit smoking to drastically reduce your risk of gum disease.",
  "Chewing sugar-free gum after eating stimulates protective saliva.",
  "Ensure you brush for a full 2 minutes, every single time.",
  "Circular motions are better than horizontal scrubbing for enamel.",
  "Sensitive teeth? Try a potassium nitrate based toothpaste.",
  "A white tongue is a sign of bacteria; clean it daily.",
  "Sugary sodas are the #1 cause of enamel erosion in adults.",
  "Grinding teeth at night? A night guard can save your smile.",
  "Healthy teeth lead to a healthier heart and body.",
  "Your smile is your best accessory; invest in its care!"
];

export const notificationService = {
  requestPermission: async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  getTodaysTip: (): string => {
    const day = new Date().getDate();
    return DENTAL_TIPS[(day - 1) % DENTAL_TIPS.length];
  },

  shouldNotifyToday: (): boolean => {
    const lastDate = localStorage.getItem('nexus_last_tip_date');
    const today = new Date().toLocaleDateString();
    return lastDate !== today;
  },

  markNotifiedToday: () => {
    localStorage.setItem('nexus_last_tip_date', new Date().toLocaleDateString());
  },

  triggerLocalNotification: (onTap: () => void) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const tip = notificationService.getTodaysTip();
    const notification = new Notification("Nexus Portal: Daily Smart Tip", {
      body: tip,
      icon: "https://api.dicebear.com/7.x/shapes/svg?seed=nexus&backgroundColor=0077b6",
      badge: "https://api.dicebear.com/7.x/shapes/svg?seed=nexus&backgroundColor=0077b6",
      tag: 'daily-tip'
    });

    notification.onclick = () => {
      window.focus();
      onTap();
      notification.close();
    };
  }
};
