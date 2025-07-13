
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create items table for storing game items
CREATE TABLE public.items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase_history table
CREATE TABLE public.purchase_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  items JSONB NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'delivered',
  payment_method TEXT NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivery_date TIMESTAMP WITH TIME ZONE
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Purchase history policies
CREATE POLICY "Users can view own purchases" ON public.purchase_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create purchases" ON public.purchase_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Items table is public (no RLS needed for reading)
-- Allow everyone to read items
CREATE POLICY "Anyone can view items" ON public.items FOR SELECT USING (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample items data
INSERT INTO public.items (id, name, price, image, category, type, description) VALUES
(1, 'Dragonbane Sword', 2999900, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 'skyrim', 'weapon', 'A legendary sword forged from dragon scales, deals massive damage to dragons and undead creatures.'),
(2, 'Daedric Shield', 1999900, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=400&h=300&fit=crop', 'skyrim', 'armor', 'A powerful shield crafted from Daedric metal, provides excellent protection against all types of attacks.'),
(3, 'Greater Health Potion', 499900, 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop', 'skyrim', 'potion', 'Restores a large amount of health instantly. Essential for surviving tough battles.'),
(4, 'Master Chief Helmet', 3999900, 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop', 'halo', 'armor', 'Iconic MJOLNIR armor helmet worn by Master Chief, provides advanced HUD and protection.'),
(5, 'Energy Sword', 4500000, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', 'halo', 'weapon', 'Covenant energy weapon that can cut through almost any material with its plasma blade.'),
(6, 'Mana Potion', 399900, 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=400&h=300&fit=crop', 'skyrim', 'potion', 'Restores magical energy, allowing mages to cast more spells in battle.'),
(7, 'Diamond Sword', 3250000, 'https://images.unsplash.com/photo-1505819244306-ef53954f9648?w=400&h=300&fit=crop', 'minecraft', 'weapon', 'One of the strongest swords in Minecraft, crafted from rare diamonds found deep underground.'),
(8, 'Netherite Armor', 2755000, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&sat=-100', 'minecraft', 'armor', 'The ultimate armor set in Minecraft, crafted from ancient debris found in the Nether.'),
(9, 'Golden Apple', 259900, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 'minecraft', 'food', 'A magical apple that provides temporary absorption hearts and regeneration effects.'),
(10, 'Spartan Cloak', 1899900, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop', 'halo', 'armor', 'Ceremonial cloak worn by Spartan warriors, symbolizing honor and strength in battle.'),
(11, 'Ebony War Hammer', 3800000, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop', 'skyrim', 'weapon', 'A massive two-handed weapon made from ebony, capable of crushing even the heaviest armor.'),
(12, 'Potion of Fire Resistance', 899900, 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=400&h=300&fit=crop&hue=30', 'minecraft', 'potion', 'Grants immunity to fire and lava damage, essential for exploring the Nether safely.'),
(13, 'AK-47 Redline', 5500000, 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=300&fit=crop', 'counter-strike', 'weapon', 'Legendary AK-47 skin with sleek red design, highly sought after by collectors and professional players.'),
(14, 'AWP Dragon Lore', 15000000, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&hue=60', 'counter-strike', 'weapon', 'The most coveted AWP skin featuring intricate dragon artwork, extremely rare and valuable.'),
(15, 'Karambit Fade', 8500000, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', 'counter-strike', 'weapon', 'Premium karambit knife with beautiful fade pattern, perfect for showing off in matches.'),
(16, 'M4A4 Howl', 6200000, 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=300&fit=crop&hue=15', 'counter-strike', 'weapon', 'Contraband M4A4 skin with fierce wolf design, no longer obtainable making it extremely valuable.'),
(17, 'Phantom Elderflame', 4800000, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&hue=30', 'valorant', 'weapon', 'Premium Phantom skin with fire-breathing dragon effects and custom animations.'),
(18, 'Vandal Prime', 3900000, 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=300&fit=crop&hue=240', 'valorant', 'weapon', 'Futuristic Vandal skin with blue energy effects and premium finisher animations.'),
(19, 'Operator Reaver', 4200000, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&hue=300', 'valorant', 'weapon', 'Dark gothic-themed Operator skin with soul-harvesting effects and unique sound design.'),
(20, 'Sheriff Singularity', 2400000, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&hue=180', 'valorant', 'weapon', 'Sci-fi themed Sheriff with black hole effects and cosmic finisher animation.');
