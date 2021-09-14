## Navigation为什么会出现？

Activity嵌套多个Fragment的UI架构模式已经是非常普遍的了，但是对于Fragment的管理然而一直是非常麻烦的事情。需要不断的通过FragmentManager和FragmentTransaction来管理Fragment之间的切换。页面的切换通常还包括对应用程序App bar的管理、Fragment间的切换动画，以及Fragment间的参数传递。纯代码的方式使用起来不是特别的友好，并且Fragment和App bar在管理和使用的过程中显得非常混乱。

所以推出Navigation组件，帮助我们管理页面的切换。

Navigation还具有以下几种优势

- 可视化的页面导航图
- 通过destination和action完成页面之间的导航
- 方便添加页面切换动画
- 页面间类型安全的参数传递
- 通过NavigationUI,对菜单、底部导航、抽屉菜单导航进行统一的管理
- 支持深层连接DeepLink

## Navigation的主要元素

**Navigation Graph**，是一种新的XML资源文件，包含应用程序所有的页面，以及页面间的关系。

**NavHostFragment**，一个特殊的Fragment，可以将其看成为一个特殊的Fragment容器。Navigation Graph中的Fragment正是通过NavHostFragment进行展示的。

**NavController**，用于在代码中完成Navigation Graph中具体的页面切换工作。

**它们三者具有这样的关系，当你想去切换Fragment时，使用NavController对象，告诉它你想要去Navigation Graph中的哪一个Fragment，NavController会将你要去的Fragment展示在NavHostFragment之中。**

## Navigation应用

现在来实现两个页面的相互跳转
假设是主页点击按钮跳转到详情页，详情页点击按钮跳转到主页。

#### 第一步，创建好你要准备相互跳转的页面(fragment)
- 主页xml
```xml
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".HomeFragment">

    <Button
        android:id="@+id/home_button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="跳转到详情页"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_bias="0.499" />
</androidx.constraintlayout.widget.ConstraintLayout>
```
- 详情页xml
```xml
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".DetailFragment">


    <Button
        android:id="@+id/detail_button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="跳转回主页"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.498"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_bias="0.481" />
</androidx.constraintlayout.widget.ConstraintLayout>
```
#### 第二步，创建Navigation Graph
Navigation Graph可以看成是一种地图资源，具体xml代码如下
```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/nav_graph"
    app:startDestination="@id/homeFragment">
    <fragment
        android:id="@+id/homeFragment"
        android:name="com.example.navigationtest.HomeFragment"
        android:label="fragment_home"
        tools:layout="@layout/fragment_home" >
        <action
            android:id="@+id/action_homeFragment_to_detailFragment"
            app:destination="@id/detailFragment" />
    </fragment>
    <fragment
        android:id="@+id/detailFragment"
        android:name="com.example.navigationtest.DetailFragment"
        android:label="fragment_detail"
        tools:layout="@layout/fragment_detail" >
        <action
            android:id="@+id/action_detailFragment_to_homeFragment"
            app:destination="@id/homeFragment" />
    </fragment>
</navigation>
```
观察上面的xml代码，通过action标签定义了一个唯一行为名称(id)，并指定一个目的地页面(detination)

#### 第三步,设置NavHostFragment容器来包容要切换的fragment页面
```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">
    <androidx.fragment.app.FragmentContainerView
        android:id="@+id/fragment"
        android:name="androidx.navigation.fragment.NavHostFragment"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:defaultNavHost="true"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:navGraph="@navigation/nav_graph" />

</androidx.constraintlayout.widget.ConstraintLayout>
```
我们旋转在这里设置fragment的页面占据整个应用的全部。

#### 第四步，设置NavController 和 点击事件
在MainActivity文件中
```java
    @Override
    protected void onStart() {
        super.onStart();
        /**
        *@this 当前活动
        *@R.id.fragment 上一步设置的NavHostFragment容器
        *找到这个容器从而返回一个navController
        */
        NavController navController = Navigation.findNavController(this,R.id.fragment);
        NavigationUI.setupActionBarWithNavController(this,navController);
    }
```
这里建议是在onStart生命周期里面去加载NavController，因为在onCreated生命周期中，NavController有可能还没创建出来

**分别在两个Fragment中设置点击事件**
只展示其中一个fragment..
```java
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_detail, container, false);
        Button btn = root.findViewById(R.id.detail_button);
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //获取到v所在的navController
                NavController navController = Navigation.findNavController(v);
                //设置导航行为，R.id.action_detailFragment_to_homeFragment就是第二步中action标签中定义的行为id。
                navController.navigate(R.id.action_detailFragment_to_homeFragment);
            }
        });
        return root;
    }
```

## 使用safe-args实现页面传参
以前传递参数的时候，我们常用putString、putInteger这样的方法，当我们从另一个页面取出变量的时候还需要回过头去看一下当时存储的值的数据类型，非常麻烦，这里借用safe-args插件来完成数据的快速传递

#### 第一步，安装相应的依赖
- 先在顶级build.gardle中配置
```java
buildscript {
    repositories {
        //.....
    }
    dependencies {
        //.....
        def nav_version = "2.3.5"
        classpath "androidx.navigation:navigation-safe-args-gradle-plugin:$nav_version"

    }
}
```

- 然后在你的应用模块对应的build.gardle中配置
```java
dependencies {
    //......
    apply plugin: "androidx.navigation.safeargs"
}
```
#### 第二步，找到你创建的graph资源，对你要传递的源fragment添加对应的argument标签
```xml
    <fragment
        android:id="@+id/homeFragment"
        android:name="com.example.navigationtest.HomeFragment"
        android:label="fragment_home"
        tools:layout="@layout/fragment_home" >
        <action
            android:id="@+id/action_homeFragment_to_detailFragment"
            app:destination="@id/detailFragment"
            app:enterAnim="@anim/nav_default_enter_anim"
            app:exitAnim="@anim/nav_default_exit_anim" />
            <!--
            - @name 你指定传递参数的变量名        
            - @argType 你要传递参数的类型
            - @defaultValue 默认值
            -->
        <argument
            android:name="user_name"
            app:argType="string"
            android:defaultValue="unknown"/>
        <argument
            android:name="age"
            app:argType="integer"
            android:defaultValue="0"/>
    </fragment>
```
这里我旋转传递两个参数，分别名为User_name和age。

#### 发送数据
```java
    Bundle args = new HomeFragmentArgs.Builder()
        .setUserName("JhinKoo")
        .setAge(18)
        .build().toBundle();
         NavController navController = Navigation.findNavController(v);
         navController.navigate(R.id.action_homeFragment_to_detailFragment,args);//这里记得通过navController将args参数带过去
```

#### 接收数据
```java
        HomeFragmentArgs args = HomeFragmentArgs.fromBundle(getArguments());
        String userName = args.getUserName();
        Integer age = args.getAge();
        Log.d("JhinKoo","这是一位"+age+"岁的"+userName);
```
