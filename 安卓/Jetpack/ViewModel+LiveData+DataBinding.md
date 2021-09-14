## JetPack是什么？

Jeepack是一个由多个库组成的套件，可以帮助开发者遵循最佳做法，减少样板代码并编写可在各种*Android*版本和设备中一致运行的代码，让开发者精力集中编写重要的代码。

- Jetpack组件采用最新的设计方法构建，具有向后兼容性
- Jetpack可以管理各种繁琐的**Activity**(如后台任务、导航和生命周期管理)

## LifeCycle

*LifeCycle*的诞生就是为了解耦，因为普通组件高度依赖于系统组件

#### 使用Lifecycle解耦页面与组件

假设现在需要我们做一个时间计时，来记录用户在页面停留的时间，就需要我们写如下的代码

```java
public class MainActivity extends AppCompatActivity {
    private Chronometer chronometer;
    private long elapsedTime;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        chronometer = (Chronometer) findViewById(R.id.chronometer);

    }

    @Override
    protected void onResume() {
        super.onResume();
        //运行时，当前时间 = 系统时间 - 离开时间
        chronometer.setBase(SystemClock.elapsedRealtime()-elapsedTime);
        chronometer.start();
    }
    @Override
    protected void onPause(){
        super.onPause();
        //暂停时,离开时间 = 系统时间 - 暂停时计时器所计的时间
        elapsedTime = SystemClock.elapsedRealtime() - chronometer.getBase();
        chronometer.stop();
    }
}
```

观察这段代码，你会发现*chronometer*和活动的生命周期的运行绑定的很深，必须要要去生命周期里面做业务逻辑处理。我们希望这个*chronometer*能脱离生命周期，单独使用。

**通过LifeCycle优化**

```java
public class MyChronometer extends Chronometer implements LifecycleObserver {
    private long elapsedTime;
    public MyChronometer(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    private void startMeter(){
        setBase(SystemClock.elapsedRealtime()-elapsedTime);
        start();
    }
    @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    private void stopMeter(){
        elapsedTime = SystemClock.elapsedRealtime() - getBase();
        stop();
    }
}

public class MainActivity extends AppCompatActivity {
    private MyChronometer  chronometer;
    private long elapsedTime;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        chronometer = (MyChronometer) findViewById(R.id.chronometer);
        //重点
        getLifecycle().addObserver(chronometer);
    }
}

```

LifeCycle可以帮助开发者建立可感知的生命周期组件，组件在其内部管理自己的生命周期，从而降低模块耦合度，降低内存泄漏发生的可能性，而且*Activity*、*Fragment*、*Service*、*Application*均有LifeCycle支持。

## ViewModel 与 LiveData

ViewModel的诞生是为了解决**瞬态数据丢失**(用户旋转屏幕之后，会导致Activity重开，数据直接清空),**异步调用的内存泄漏**,**类膨胀提高维护难度和测试难度**。

ViewModel使得视图和数据模型进行分离，同时保持着较好的通信。

LiveData则是负责告诉View,你的ViewModel发生了更新。

#### 通过ViewModel实现防止瞬态数据丢失

现在我们来实现点击按钮，让屏幕上的数字+1，然后旋转屏幕之后数字不会归0。

- 第一步，建立自己的ViewModel,类似于Vue框架里面的data对象

```java
public class MyViewModel extends ViewModel {
    public int number;
}
```

- 第二步，实现对应代码

```java
public class MainActivity extends AppCompatActivity {
    private TextView textView;
    private MyViewModel viewModel;
    private Button btn;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        textView = findViewById(R.id.textView);
        btn = findViewById(R.id.plusBtn);
        /**
         * 创建一个ViewModel的实例
         * @this 代表当前的的viewModel拥有者，相当于是绑定在了这个活动上
         * @MyViewModel.class:加载我们创建的ViewModel类
         * */
        viewModel = new ViewModelProvider(this,
                new ViewModelProvider.AndroidViewModelFactory(
                        getApplication()
                )).get(MyViewModel.class);
        //这句话就是防止数据动态丢失的重中之重
        textView.setText(String.valueOf(viewModel.number));
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                plusNumber(v);
            }
        });
    }

    public void plusNumber(View v){
        textView.setText(String.valueOf(++viewModel.number));
    }
}
```

**注意点**：

- 不要向ViewModel中传入Context，会导致内存泄漏
- 如果要使用Context，请使用**AndroidViewModel**中的**Application**。

```java
public class MyViewModel extends AndroidViewModel {
    public MyViewModel(@NonNull Application application){
        super(application);
    }
    public int number;
}
```

#### 通过LiveData实现UI更新

```java
public class MyViewModel extends ViewModel {
    //MutableLiveData是LiveData的一个子类，LiveData是一个抽象类
    private MutableLiveData<Integer> currentSecond;
    public MutableLiveData<Integer> getCurrentSecond(){
        if(currentSecond == null){
            currentSecond = new MutableLiveData<>();
            currentSecond.setValue(0);
        }
        return currentSecond;
    }
}
```

```java
public class MainActivity extends AppCompatActivity {
    private TextView textView;
    private MyViewModel viewModel;
    private Button btn;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        textView = findViewById(R.id.textView);
        btn = findViewById(R.id.plusBtn);
        viewModel = new ViewModelProvider(this,
                new ViewModelProvider.AndroidViewModelFactory(
                        getApplication()
                )).get(MyViewModel.class);
        textView.setText(String.valueOf(viewModel.getCurrentSecond().getValue()));
        viewModel.getCurrentSecond().observe(this, new Observer<Integer>() {
            @Override
            public void onChanged(Integer i) {
                textView.setText(i);
            }
        });
        startTimer();
    }
    private void startTimer(){
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                //异步线程：postValue
                //主线程：setValue
                viewModel.getCurrentSecond().postValue(viewModel.getCurrentSecond().getValue()+1);
            }
        },1000,1000);
    }
}
```

#### 通过 ViewModel + LiveData 实现不同Fragment之间的通信

LiveData具有一种监听变化的功能，当数据发生变化的时候，能够执行相应的逻辑代码，因此可以实现两个fragment之间的互相通信。

现在我们来做这么一个案例：设置两个fragment，每个fragment里面都有一个数字，点击 +号 按钮，两个fragment里面的数字都会增加

- 有按钮的fragment

```java
public class SecondFragment extends Fragment {
    private Button addBtn;
    private TextView textView;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_second, container, false);
        addBtn =  root.findViewById(R.id.add_btn);
        textView = root.findViewById(R.id.number_view);
        MyViewModel viewModel = new ViewModelProvider(getActivity(),
                new ViewModelProvider.AndroidViewModelFactory(getActivity().getApplication()))
                .get(MyViewModel.class);
        textView.setText(String.valueOf(viewModel.getNumber().getValue()));
        viewModel.getNumber().observe(getActivity(), new Observer<Integer>() {
            @Override
            public void onChanged(Integer i) {
               textView.setText(i.toString());
            }
        });
        addBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                    viewModel.getNumber().setValue(viewModel.getNumber().getValue()+1);
            }
        });
        super.onCreate(savedInstanceState);
        return root;
    }
}
```

- 无按钮的fragment

```java
public class FristFragment extends Fragment {
    private TextView textView;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View root = inflater.inflate(R.layout.fragment_frist, container, false);
        textView = root.findViewById(R.id.number_view);
        MyViewModel viewModel = new ViewModelProvider(getActivity(),
                new ViewModelProvider.AndroidViewModelFactory(getActivity().getApplication()))
                .get(MyViewModel.class);
        textView.setText(String.valueOf(viewModel.getNumber().getValue()));
        viewModel.getNumber().observe(getActivity(), new Observer<Integer>() {
            @Override
            public void onChanged(Integer i) {
                textView.setText(i.toString());
            }
        });
        return root;
    }
}
```

## DataBinding

DataBinding存在的意义是让布局文件承担部分原本属于页面的工作，是页面与布局的耦合度进一步降低。

也就是说要在xml文件中写一些逻辑代码，虽然会很奇怪，但是更加符合 **数据驱动** 这一概念。

#### DataBinding实现数据展示

假设现在我要做这么一个案例，在页面上进行一张图片展示，并且显示出这种图片的高度和宽度。

**第一步**，在gradle文件中进行相关配置

```java
android {
    ...
    buildFeatures {
        dataBinding true
    }
}
```

**第二步**，在xml文件构建相关结构

- 搭建好你基本的结构

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context=".MainActivity">
    <!--图片-->
    <ImageView
        android:layout_width="match_parent"
        android:layout_height="400dp"
        android:padding="20dp"
        android:src="@drawable/ic_launcher_background" />
    <!--展示宽度-->    
    <TextView
        android:layout_height="30dp"
        android:textSize="25dp"
        android:layout_width="match_parent" />
    <!--展示高度-->
    <TextView
        android:layout_height="30dp"
        android:layout_width="match_parent"
        android:textSize="25dp"
        />
</LinearLayout>
```

- 这里，按下键盘的 **Alt + Enter**,会出现一个弹窗，旋转*covert to databinding layout*，布局就会自动变成以下的样子

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <data>
        <!-- data标签里面可以接收一个对象 -->
    </data>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        tools:context=".MainActivity">

        <ImageView
            android:layout_width="match_parent"
            android:layout_height="400dp"
            android:padding="20dp"
            android:src="@drawable/ic_launcher_background" />

        <TextView
            android:layout_height="30dp"
            android:textSize="25dp"
            android:layout_width="match_parent" />

        <TextView
            android:layout_height="30dp"
            android:layout_width="match_parent"
            android:textSize="25dp" />
    </LinearLayout>
</layout>
```

**第三步**，由于data标签需要接收一个对象，这里我们创建一个相应的图片对象类。

- 创建对象

```java
public class MyImg {
    //这里也可以对width和height进行封装。添加对应的getter和setter即可
    public String width;
    public String height;
    public MyImg(String width,String height){
        this.width = width;
        this.height = height;
    }
}
```

- 回到刚刚的xml文件中去，修改一下data里面的内容

```xml
    <data>
        <variable
            name="MyImg"
            type="com.example.lifecycle.MyImg"
            />
    </data>
    <!--注意一下type熟悉里面要写完整的包名-->
```

**第四步**，修改MainActivity里面的代码，修改加载布局方式

```java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        /* DataBindingUtil.setContentView返回一个Binding对象
         * 不同的布局名这个Binding对象的名称也不一样，
         * 比如，我们这次加载的布局名为activity_main，所以Binding对象名为 ActivityMainBinding
         * 如果，另一个布局名为xxx_yyy，那么另一个Binding对象名为XxxYyyBinding
         * */
        ActivityMainBinding activityMainBinding =
                DataBindingUtil.setContentView(this,R.layout.activity_main);
        MyImg img = new MyImg("宽度为400dp","高度为100dp");
        activityMainBinding.setMyImg(img);
    }
}
```

**第五步**,再次回到xml文件中进行数据注入

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <data>
        <variable
            name="MyImg"
            type="com.example.lifecycle.MyImg"
            />
    </data>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        tools:context=".MainActivity">

        <ImageView
            android:layout_width="match_parent"
            android:layout_height="400dp"
            android:padding="20dp"
            android:src="@drawable/ic_launcher_background" />

        <TextView
            android:layout_height="30dp"
            android:textSize="25dp"
            android:text="@{MyImg.width}"
            android:layout_width="match_parent" />

        <TextView
            android:layout_height="30dp"
            android:layout_width="match_parent"
            android:text="@{MyImg.height}"
            android:textSize="25dp" />
    </LinearLayout>
</layout>
<!--
通过对应的熟悉 用 @{ .... } 这样的方式注入你创建的对象数据
-->
```

#### import标签和事件绑定

**import标签**
还是上面的例子，如果我们要对传入的数据做进一步的处理怎么办，比如类型转换、格式整理...等等。

只需要手动创建一个import标签，引入对应的方法

```xml
    <data>
        <variable
            name="MyImg"
            type="com.example.lifecycle.MyImg"
            />
        <import type="com.example.lifecycle.formatData">
    </data>
```

这个formatData是一个修改数据内容格式的静态方法，具体逻辑不展示了

```xml
        <TextView
            android:layout_height="30dp"
            android:layout_width="match_parent"
            android:text="@{formatData(MyImg.height)}"
            android:textSize="25dp" />
```

**事件绑定**
在上述的代码基础上，给TextView添加一个点击事件

- 实现一个事件类

```java
public class EventHandlerListener {
    private Context context;
    public EventHandlerListener(Context context){
        this.context = context;
    }
    public void TextViewOnClick(View v){
        Toast.makeText(context,"你点击了textview",Toast.LENGTH_SHORT).show();
    }
}
```

- 在Binding中注册事件

```java
 activityMainBinding.setEventHandler(new EventHandlerListener(this));
```

- 在xml中给对应的textView导入相应的事件

```xml
    <data>
        <variable
            name="MyImg"
            type="com.example.lifecycle.MyImg"
            />
        <variable
            name="eventHandler"
            type="com.example.lifecycle.EventHandlerListener"
            />
    </data>
```

```xml
        <TextView
            android:layout_height="30dp"
            android:textSize="25dp"
            android:text="@{MyImg.width}"
            android:onClick="@{eventHandler.TextViewOnClick}"
            android:layout_width="match_parent" />
```

如果是直接调用的是ViewModel里面的方法，就像这么来调用

```xml
        <TextView
            android:layout_height="30dp"
            android:textSize="25dp"
            android:text="@{MyImg.width}"
            android:onClick="@{()=>ViewModel.TextViewOnClick}"
            android:layout_width="match_parent" />
```

#### 二级页面的绑定

对于给二级页面绑定，逻辑上应该要求数据能够从一级页面上传给二级页面

还是按照之前的代码修改：
主页面

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools">
    <data>
        <variable
            name="Img"
            type="com.example.lifecycle.MyImg"
            />
    </data>
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        tools:context=".MainActivity">

        <ImageView
            android:layout_width="match_parent"
            android:layout_height="400dp"
            android:padding="20dp"
            android:src="@drawable/ic_launcher_background" />
        <include
            app:Img="@{Img}"
            layout="@layout/sub" />
    </LinearLayout>
</layout>
```

一定要通过include标签中的app属性将对应的对象传入到下一级页面里面去。

二级页面

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android">

    <data>
        <variable
            name="Img"
            type="com.example.lifecycle.MyImg"
            />
    </data>

    <LinearLayout
        android:orientation="vertical"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <TextView
            android:layout_height="30dp"
            android:textSize="25dp"
            android:text="@{Img.width}"
            android:layout_width="match_parent" />

        <TextView
            android:layout_height="30dp"
            android:text="@{Img.height}"
            android:layout_width="match_parent"
            android:textSize="25dp" />
    </LinearLayout>
</layout>
```

#### 双向绑定

当字段变化时，界面上的内容也自动变化。
当用户修改界面上的内容时，实体对象里面的字段也会发生变化。

**OberservableField**实现双向绑定。

- 第一步，创建实体类

```java
public class Content {
    public String text;
    public Content(String content){
        text = content;
    }
}
```

- 第二步，创建*ObservableField*

```java
public class ContentViewModel {
    private ObservableField<Content> contentObservableField;
    public ContentViewModel(){
        Content c = new Content("");
        contentObservableField = new ObservableField<>();
        contentObservableField.set(c);
    }
    public String getContentText(){
        return contentObservableField.get().text;
    }
    public void setContentText(String t){
        contentObservableField.get().text = t;
    }
}
```

- 第三步，加载布局

```java
        ActivityMainBinding activityMainBinding =
                DataBindingUtil.setContentView(this,R.layout.activity_main);
        activityMainBinding.setContentViewModel(new ContentViewModel());
```

## 总结

接下来通过一个综合性案例来复习一下以上学到的知识点
**通过ViewModel + LiveData + DataBinding**完成一个计分器
示例

<img src="D:\Study\学习笔记md\安卓开发\images\计分器.png" alt="计分器" style="zoom:50%;" />

**XML**代码

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools">

    <data>
        <variable
            name="ScoreViewModel"
            type="com.example.constraintlayouttest.ScoreViewModel"
            />
    </data>

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        tools:context=".MainActivity">

        <TextView
            android:id="@+id/team1"
            android:text="team1"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toLeftOf="@+id/team2"
            app:layout_constraintTop_toTopOf="parent"
            android:layout_height="wrap_content"
            android:layout_width="wrap_content"
            android:layout_marginTop="40dp"
            android:textSize="20sp" />

        <TextView
            android:id="@id/team2"
            android:text="team2"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintLeft_toRightOf="@+id/team1"
            app:layout_constraintTop_toTopOf="parent"
            android:layout_height="wrap_content"
            android:layout_width="wrap_content"
            android:layout_marginTop="40dp"
            android:textSize="20sp" />

        <TextView
            android:id="@+id/team1_score"
            app:layout_constraintTop_toBottomOf="@id/team1"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toLeftOf="@id/team2_score"
            android:layout_height="wrap_content"
            android:layout_width="wrap_content"
            android:textSize="40sp"
            android:layout_marginTop="20dp"
            android:textColor="#43A047"
            android:text="@{ScoreViewModel.getTeam1Score().toString()}"
            tools:text="0" />

        <TextView
            android:id="@+id/team2_score"
            app:layout_constraintTop_toBottomOf="@id/team2"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintLeft_toRightOf="@id/team1_score"
            android:layout_height="wrap_content"
            android:layout_width="wrap_content"
            android:textSize="40sp"
            android:layout_marginTop="20dp"
            android:textColor="#0288D1"
            android:text="@{ScoreViewModel.getTeam2Score().toString()}"
            tools:text="1" />

        <Button
            android:id="@+id/team1_addone"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="+1"
            android:onClick="@{()->ScoreViewModel.team1Add(1)}"
            android:textSize="18sp"
            app:layout_constraintTop_toBottomOf="@id/team1_score"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toLeftOf="@id/team2_addone"
            android:layout_marginTop="20dp" />

        <Button
            android:id="@+id/team2_addone"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="+1"
            android:onClick="@{()->ScoreViewModel.team2Add(1)}"
            android:textSize="18sp"
            app:layout_constraintTop_toBottomOf="@id/team2_score"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintLeft_toRightOf="@id/team1_addone"
            android:layout_marginTop="20dp" />

        <Button
            android:id="@+id/team1_addtwo"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="+2"
            android:onClick="@{()->ScoreViewModel.team1Add(2)}"
            android:textSize="18sp"
            app:layout_constraintTop_toBottomOf="@id/team1_addone"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toLeftOf="@id/team2_addtwo"
            android:layout_marginTop="20dp" />

        <Button
            android:id="@+id/team2_addtwo"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="+2"
            android:onClick="@{()->ScoreViewModel.team2Add(2)}"
            android:textSize="18sp"
            app:layout_constraintTop_toBottomOf="@id/team2_addone"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintLeft_toRightOf="@id/team1_addtwo"
            android:layout_marginTop="20dp" />

        <Button
            android:id="@+id/team1_addthree"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="+3"
            android:onClick="@{()->ScoreViewModel.team1Add(3)}"
            android:textSize="18sp"
            app:layout_constraintTop_toBottomOf="@id/team1_addtwo"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toLeftOf="@id/team2_addthree"
            android:layout_marginTop="20dp" />

        <Button
            android:id="@+id/team2_addthree"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="+3"
            android:onClick="@{()->ScoreViewModel.team2Add(3)}"
            android:textSize="18sp"
            app:layout_constraintTop_toBottomOf="@id/team2_addtwo"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintLeft_toRightOf="@id/team1_addthree"
            android:layout_marginTop="20dp" />

        <Button
            android:id="@+id/cancel_btn"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="撤回"
            android:onClick="@{()->ScoreViewModel.cancel()}"
            android:textSize="18sp"
            app:layout_constraintTop_toBottomOf="@id/team1_addthree"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toLeftOf="@id/reset_btn"
            android:layout_marginTop="20dp" />

        <Button
            android:id="@+id/reset_btn"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="重置"
            android:onClick="@{()->ScoreViewModel.reset()}"
            android:textSize="18sp"
            app:layout_constraintTop_toBottomOf="@id/team2_addthree"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintLeft_toRightOf="@id/cancel_btn"
            android:layout_marginTop="20dp" />
    </androidx.constraintlayout.widget.ConstraintLayout>
</layout>
```

**ViewModel类**

```java
public class ScoreViewModel extends ViewModel {
    private MutableLiveData<Integer> team1Score;
    private MutableLiveData<Integer> team2Score;
    private int team1LastScore = 0;
    private int team2LastScore = 0;

    public MutableLiveData<Integer> getTeam1Score() {
        if(team1Score == null){
            team1Score =  new MutableLiveData<>();
            team1Score.setValue(0);
        }
        return team1Score;
    }
    public MutableLiveData<Integer> getTeam2Score(){
        if(team2Score == null){
            team2Score = new MutableLiveData<>();
            team2Score.setValue(0);
        }
        return team2Score;
    }
    public void team1Add(int i){
        team1LastScore = team1Score.getValue();
        int newScore = CalculateScore.addScore(team1Score.getValue(),i);
        team1Score.setValue(newScore);
    }
    public void team2Add(int i){
        team2LastScore = team2Score.getValue();
        int newScore = CalculateScore.addScore(team2Score.getValue(),i);
        team2Score.setValue(newScore);
    }
    public void cancel(){
        team1Score.setValue(team1LastScore);
        team2Score.setValue(team2LastScore);
    }
    public void reset(){
        team2Score.setValue(CalculateScore.resetScore());
        team1Score.setValue(CalculateScore.resetScore());
    }
}

```

**逻辑代码**

```java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActivityMainBinding activityMainBinding =
                DataBindingUtil.setContentView(this,R.layout.activity_main);
        ScoreViewModel viewModel = new ViewModelProvider(this,
                new ViewModelProvider.AndroidViewModelFactory(getApplication())).get(ScoreViewModel.class);
        activityMainBinding.setScoreViewModel(viewModel);
        //如果要让DataBinding和LiveData能正常使用，还得添加这一句话
        activityMainBinding.setLifecycleOwner(this);
    }
}
```

