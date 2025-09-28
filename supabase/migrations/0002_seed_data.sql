-- Seed data for contacts
INSERT INTO contacts (name, email, phone, company, role, status, notes, avatar, lastContact) VALUES
('Sarah Wilson', 'sarah.wilson@techcorp.com', '+1 (555) 123-4567', 'TechCorp Inc.', 'CTO', 'Customer', 'Key decision maker for enterprise software purchases', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '2024-01-15'),
('Michael Chen', 'm.chen@startupxyz.com', '+1 (555) 234-5678', 'StartupXYZ', 'CEO', 'Lead', 'Interested in marketing automation solutions', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '2024-01-14'),
('Emily Rodriguez', 'emily.r@globalsolutions.com', '+1 (555) 345-6789', 'Global Solutions', 'IT Director', 'Active', 'Evaluating cloud migration options', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '2024-01-12');

-- Seed data for deals
INSERT INTO deals (contact_id, name, stage, value, probability, expectedClose, description, owner, ownerAvatar) VALUES
(1, 'Enterprise Software License', 'Negotiation', 45000, 75, '2024-02-15', 'Large enterprise software licensing deal for 500+ users', 'Jane Doe', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'),
(2, 'Marketing Automation Setup', 'Proposal', 12500, 60, '2024-01-30', 'Complete marketing automation platform implementation', 'Mike Roberts', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
(3, 'Cloud Migration Project', 'Qualified', 78000, 40, '2024-03-01', 'Full cloud infrastructure migration and optimization', 'Sarah Johnson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face');

-- Seed data for tasks
INSERT INTO tasks (deal_id, contact_id, title, description, due_date, completed, status, priority, assignee, assigneeAvatar) VALUES
(1, 1, 'Follow up with TechCorp Inc.', 'Schedule demo call for enterprise software license', '2024-01-20', false, 'Todo', 'High', 'Jane Doe', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'),
(2, 2, 'Prepare proposal for StartupXYZ', 'Create detailed proposal for marketing automation setup', '2024-01-18', false, 'In Progress', 'Medium', 'Mike Roberts', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
(3, 3, 'Send contract to Global Solutions', 'Finalize and send signed contract for cloud migration project', '2024-01-16', true, 'Completed', 'High', 'Sarah Johnson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face');
