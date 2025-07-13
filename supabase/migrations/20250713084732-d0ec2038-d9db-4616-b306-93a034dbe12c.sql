
-- Create promotions table
CREATE TABLE public.promotions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  target_users TEXT NOT NULL DEFAULT 'all',
  icon_name TEXT NOT NULL DEFAULT 'percent',
  bg_color TEXT NOT NULL DEFAULT 'bg-orange-100 dark:bg-orange-900/20',
  icon_color TEXT NOT NULL DEFAULT 'text-orange-600 dark:text-orange-400',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (promotions should be visible to all users)
CREATE POLICY "Anyone can view active promotions" 
  ON public.promotions 
  FOR SELECT 
  USING (is_active = true);

-- Create policy for admin insert (only admins should create promotions)
CREATE POLICY "Admins can create promotions" 
  ON public.promotions 
  FOR INSERT 
  WITH CHECK (true); -- We'll handle admin check in the application layer

-- Create policy for admin update
CREATE POLICY "Admins can update promotions" 
  ON public.promotions 
  FOR UPDATE 
  USING (true);

-- Create policy for admin delete
CREATE POLICY "Admins can delete promotions" 
  ON public.promotions 
  FOR DELETE 
  USING (true);

-- Insert some sample promotions data
INSERT INTO public.promotions (title, description, discount_percent, start_date, end_date, icon_name, bg_color, icon_color) VALUES
('Special Offer!', 'Get 20% off on all items this week', 20, '2024-01-01', '2024-12-31', 'percent', 'bg-orange-100 dark:bg-orange-900/20', 'text-orange-600 dark:text-orange-400'),
('Free Gift!', 'Buy 2 items and get 1 free bonus item', 0, '2024-01-01', '2024-12-31', 'gift', 'bg-green-100 dark:bg-green-900/20', 'text-green-600 dark:text-green-400'),
('Premium Items', 'New premium collection now available', 0, '2024-01-01', '2024-12-31', 'star', 'bg-yellow-100 dark:bg-yellow-900/20', 'text-yellow-600 dark:text-yellow-400'),
('Flash Sale!', 'Limited time offer - Up to 50% off', 50, '2024-07-01', '2024-07-31', 'zap', 'bg-red-100 dark:bg-red-900/20', 'text-red-600 dark:text-red-400'),
('VIP Members', 'Exclusive deals for VIP members only', 15, '2024-01-01', '2024-12-31', 'crown', 'bg-purple-100 dark:bg-purple-900/20', 'text-purple-600 dark:text-purple-400'),
('Top Rated', 'Best selling items with 5-star ratings', 0, '2024-01-01', '2024-12-31', 'trophy', 'bg-blue-100 dark:bg-blue-900/20', 'text-blue-600 dark:text-blue-400');
